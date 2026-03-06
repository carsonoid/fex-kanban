import { Request, Response } from "express";

import { Column, UpdateColumnRequest } from "../../../shared/types/columns";

import { pool } from "../config/db";
import { ErrorNotFound } from "../../../shared/types/errors";

export const create = async (request: Request, response: Response) => {
  const req: Column = request.body;

  const boardId = request.params["board_id"] as string;

  // id can be given, or it will be generated as a uuid
  // this may not be ideal API design but it makes for easy manual testing
  // and this is just a personal learning project
  const id = (request.params["id"] as string) || crypto.randomUUID();

  const now = new Date();

  const _ = await pool.query({
    text: 'INSERT INTO columns (id, board_id, name, "order", wip_limit, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
    values: [id, boardId, req.name, req.order, req.wip_limit, now],
  });

  response.status(201);
  response.json(await getColumn(id, boardId));
};

export const update = async (request: Request, response: Response) => {
  const req: UpdateColumnRequest = request.body;

  const boardId = request.params["board_id"] as string;
  const id = request.params["id"] as string;

  if (req.name) {
    const _ = await pool.query({
      text: "UPDATE columns SET name = $2 WHERE id = $1 AND board_id = $3",
      values: [id, req.name, boardId],
    });
  }

  if (req.wip_limit) {
    const _ = await pool.query({
      text: "UPDATE columns SET wip_limit = $2 WHERE id = $1 AND board_id = $3",
      values: [id, req.wip_limit, boardId],
    });
  }

  response.json(await getColumn(id, boardId));
};

export const del = async (request: Request, response: Response) => {
  const boardId = request.params["board_id"] as string;
  const id = request.params["id"] as string;

  const _ = await pool.query({
    text: "DELETE FROM columns WHERE id = $1 AND board_id = $2",
    values: [id, boardId],
  });

  response.status(204);

  response.json({});
};

export const getColumnsForBoard = async (
  boardId: string
): Promise<Column[]> => {
  const resp = await pool.query({
    text: 'SELECT id, board_id, name, "order", wip_limit, created_at FROM columns where board_id = $1',
    values: [boardId],
  });

  const columns: Column[] = [];

  resp.rows.forEach((row) => {
    columns.push({
      board_id: boardId,
      id: row.id,
      name: row.name,
      order: row.order,
      wip_limit: row.wip_limit,
      created_at: row.created_at,
    } as Column);
  });

  return columns;
};

const getColumn = async (id: string, boardId: string): Promise<Column> => {
  const resp = await pool.query({
    text: 'SELECT id, board_id, name, "order", wip_limit, created_at FROM columns where id = $1 AND board_id = $2',
    values: [id, boardId],
  });

  if (resp.rows.length < 1) {
    throw ErrorNotFound;
  }

  const row = resp.rows[0];
  return {
    id: row.id,
    board_id: row.board_id,
    name: row.name,
    order: row.order,
    wip_limit: row.wip_limit,
    created_at: row.created_at,
  } as Column;
};
