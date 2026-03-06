import { Request, Response } from "express";

import { Column, UpdateColumnRequest } from "../../../shared/types/columns";

import { pool } from "../config/db";
import { ErrorNotFound } from "../../../shared/types/errors";
import { Subtask, UpdateSubtaskRequest } from "../../../shared/types/cards";

export const create = async (request: Request, response: Response) => {
  const req: Subtask = request.body;

  const cardId = request.params["card_id"] as string;

  // id can be given, or it will be generated as a uuid
  // this may not be ideal API design but it makes for easy manual testing
  // and this is just a personal learning project
  const id = (request.params["id"] as string) || crypto.randomUUID();

  const _ = await pool.query({
    text: "INSERT INTO subtasks (id, card_id, name, completed) VALUES ($1, $2, $3, $4)",
    values: [id, cardId, req.name, req.completed],
  });

  response.json(await getSubtask(id, cardId));
};

export const update = async (request: Request, response: Response) => {
  const req: UpdateSubtaskRequest = request.body;

  const cardId = request.params["card_id"] as string;
  const id = request.params["id"] as string;

  if (req.name) {
    const _ = await pool.query({
      text: "UPDATE subtasks SET name = $1 WHERE id = $2 AND card_id = $3",
      values: [req.name, id, cardId],
    });
  }

  if (req.completed !== undefined) {
    const _ = await pool.query({
      text: "UPDATE subtasks SET completed = $1 WHERE id = $2 AND card_id = $3",
      values: [req.completed, id, cardId],
    });
  }

  response.json(await getSubtask(id, cardId));
};

export const del = async (request: Request, response: Response) => {
  const cardId = request.params["card_id"] as string;
  const id = request.params["id"] as string;

  const _ = await pool.query({
    text: "DELETE FROM subtasks WHERE id = $1 AND card_id = $2",
    values: [id, cardId],
  });

  response.json({});
};

const getSubtask = async (id: string, cardId: string): Promise<Subtask> => {
  const resp = await pool.query({
    text: "SELECT name, completed FROM subtasks where id = $1 AND card_id = $2",
    values: [id, cardId],
  });

  if (resp.rows.length < 1) {
    throw ErrorNotFound;
  }

  const row = resp.rows[0];
  return {
    id: id,
    card_id: cardId,
    name: row.name,
    completed: row.completed,
  } as Subtask;
};
