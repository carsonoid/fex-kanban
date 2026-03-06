import { Request, Response } from "express";

import {
  Board,
  BoardWithColumns,
  CreateBoardRequest,
  DeleteBoardResponse,
  ListBoardsResponse,
  UpdateBoardRequest,
} from "../../../shared/types/boards";
import { APIError, ErrorNotFound } from "../../../shared/types/errors";

import { pool } from "../config/db";
import { getColumnsForBoard } from "./columns";

export const create = async (request: Request, response: Response) => {
  const req: CreateBoardRequest = request.body;

  // id can be given, or it will be generated as a uuid
  // this may not be ideal API design but it makes for easy manual testing
  // and this is just a personal learning project
  const id = (request.params["id"] as string) || crypto.randomUUID();

  const now = new Date();
  const userID = crypto.randomUUID(); // TODO: from auth token

  const _ = await pool.query({
    text: "INSERT INTO boards (id, name, description, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [id, req.name, req.description, now, now, userID],
  });

  response.json(await getBoard(id));
};

export const get = async (request: Request, response: Response) => {
  const id = request.params["id"] as string;
  response.json(await getBoard(id));
};

const getBoard = async (id: string): Promise<BoardWithColumns> => {
  const resp = await pool.query({
    text: "SELECT id, name, description, created_at, updated_at, user_id FROM boards where id = $1",
    values: [id],
  });

  if (resp.rows.length < 1) {
    throw ErrorNotFound;
  }

  const row = resp.rows[0];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id,
    columns: await getColumnsForBoard(id),
  } as BoardWithColumns;
};

export const list = async (request: Request, response: Response) => {
  const resp = await pool.query({
    text: "SELECT id, name, description, created_at, updated_at, user_id FROM boards",
  });

  const res: ListBoardsResponse = {
    boards: [],
  };

  resp.rows.forEach((row) => {
    res.boards.push({
      id: row.id,
      name: row.name,
      description: row.description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      user_id: row.user_id,
    });
  });

  response.json(res);
};

export const update = async (request: Request, response: Response) => {
  const id = request.params["id"] as string;

  const req: UpdateBoardRequest = request.body;

  if (req.name) {
    const _ = await pool.query({
      text: "UPDATE boards SET name = $2 WHERE id = $1",
      values: [id, req.name],
    });
  }

  if (req.description) {
    const _ = await pool.query({
      text: "UPDATE boards SET description = $2 WHERE id = $1",
      values: [id, req.description],
    });
  }

  response.json(await getBoard(id));
};

export const del = async (request: Request, response: Response) => {
  const id = request.params["id"] as string;

  const _ = await pool.query({
    text: "DELETE FROM boards  WHERE id = $1",
    values: [id],
  });

  const res: DeleteBoardResponse = {};
  response.status(204);
  response.json(res);
};
