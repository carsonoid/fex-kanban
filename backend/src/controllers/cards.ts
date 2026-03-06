import { Request, Response } from "express";

import {
  Card,
  MoveCardRequest,
  Subtask,
  UpdateCardRequest,
} from "../../../shared/types/cards";

import { pool } from "../config/db";
import { ErrorNotFound } from "../../../shared/types/errors";

export const create = async (request: Request, response: Response) => {
  const req: Card = request.body;

  // id can be given, or it will be generated as a uuid
  // this may not be ideal API design but it makes for easy manual testing
  // and this is just a personal learning project
  const id = (request.params["id"] as string) || crypto.randomUUID();

  const now = new Date();
  const userID = crypto.randomUUID(); // TODO: from auth token

  const _ = await pool.query({
    text: "INSERT INTO cards (id, column_id, name, description, labels, priority, due_date, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    values: [
      id,
      req.column_id,
      req.name,
      req.description,
      JSON.stringify(req.labels),
      req.priority,
      req.due_date,
      now,
      now,
    ],
  });

  response.status(201);
  response.json(await getCard(id));
};

export const get = async (request: Request, response: Response) => {
  const id = request.params["id"] as string;

  response.json(await getCard(id));
};

export const update = async (request: Request, response: Response) => {
  const req: UpdateCardRequest = request.body;

  const id = request.params["id"] as string;

  req.name &&
    (await pool.query({
      text: "UPDATE cards SET name = $2 WHERE id = $1",
      values: [id, req.name],
    }));

  req.description &&
    (await pool.query({
      text: "UPDATE cards SET description = $2 WHERE id = $1",
      values: [id, req.description],
    }));

  req.priority !== undefined &&
    (await pool.query({
      text: "UPDATE cards SET priority = $2 WHERE id = $1",
      values: [id, req.priority],
    }));

  req.labels !== undefined &&
    (await pool.query({
      text: "UPDATE cards SET labels = $2 WHERE id = $1",
      values: [id, JSON.stringify(req.labels)],
    }));

  response.json(await getCard(id));
};

export const move = async (request: Request, response: Response) => {
  const req: MoveCardRequest = request.body;

  const id = request.params["id"] as string;

  const _ = await pool.query({
    text: 'UPDATE cards SET column_id = $2, "order" = $3 WHERE id = $1',
    values: [id, req.column_id, req.order || 0],
  });

  response.json(await getCard(id));
};

export const del = async (request: Request, response: Response) => {
  const id = request.params["id"] as string;

  const _ = await pool.query({
    text: "DELETE FROM cards WHERE id = $1",
    values: [id],
  });

  response.json({});
};

const getCard = async (id: string): Promise<Card> => {
  const resp = await pool.query({
    text: "SELECT name, column_id, name, description, labels, priority, due_date, created_at, updated_at FROM cards where id = $1",
    values: [id],
  });

  if (resp.rows.length < 1) {
    throw ErrorNotFound;
  }

  const row = resp.rows[0];
  return {
    id: id,
    column_id: row.column_id,
    name: row.name,
    description: row.description,
    order: row.order,
    priority: row.priority,
    due_date: row.due_date,
    labels: row.labels,
    // assignee: req.assignee,
    subtasks: await getSubtasksForCard(id),
    created_at: row.created_at,
    updated_at: row.updated_at,
  } as Card;
};

export const getSubtasksForCard = async (
  cardId: string
): Promise<Subtask[]> => {
  const resp = await pool.query({
    text: `SELECT subtasks.id, subtasks.name, subtasks.completed FROM subtasks
    JOIN cards on subtasks.card_id = cards.id
    WHERE subtasks.card_id = $1
    `,
    values: [cardId],
  });

  const labels: Subtask[] = [];

  resp.rows.forEach((row) => {
    labels.push({
      id: row.id,
      card_id: cardId,
      name: row.name,
      completed: row.completed,
    } as Subtask);
  });

  return labels;
};
