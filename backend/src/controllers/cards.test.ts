import request from "supertest";
import { app } from "../app";
import { Board, BoardWithColumns } from "../../../shared/types/boards";
import { Column, UpdateColumnRequest } from "../../../shared/types/columns";
import { API_ENDPOINTS } from "../../../shared/types/server";
import {
  Card,
  MoveCardRequest,
  Subtask,
  UpdateCardRequest,
  UpdateSubtaskRequest,
} from "../../../shared/types/cards";
import { Label, UpdateLabelRequest } from "../../../shared/types/labels";

describe("Cards API", () => {
  const board_ids = [];

  const newBoard = async () => {
    const res = await request(app).post(API_ENDPOINTS.BOARDS.CREATE).send({
      name: "test board",
      description: "test board descr",
    });
    const b = res.body as Board;
    board_ids.push(b.id);
    return b;
  };

  const newColumn = async () => {
    const board = await newBoard();
    const res = await request(app)
      .post(API_ENDPOINTS.COLUMNS.CREATE(board.id))
      .send({ board_id: board.id, name: "test column" });
    return res.body as Column;
  };

  const newCard = async () => {
    const column = await newColumn();
    const res = await request(app)
      .post(API_ENDPOINTS.CARDS.CREATE)
      .send({
        column_id: column.id,
        description: "card descr",
        name: "test card",
        priority: "high",
      } as Card)
      .expect(201);
    return res.body as Card;
  };

  afterAll(async () => {
    for (const board_id of board_ids) {
      await request(app).delete(API_ENDPOINTS.BOARDS.DELETE(board_id));
    }
  });

  describe("create", () => {
    test("creates a card", async () => {
      const c = await newColumn();
      const card = {
        column_id: c.id,
        description: "card descr",
        name: "test card",
        priority: "high",
        labels: ["test1", "test2"],
      } as Card;
      const res = await request(app)
        .post(API_ENDPOINTS.CARDS.CREATE)
        .send(card)
        .expect(201);

      expect(res.body).toMatchObject(card);

      // create with same id fails
      await request(app)
        .post(API_ENDPOINTS.CARDS.CREATE_ID(res.body.id))
        .send(card)
        .expect(409);
    });
  });

  describe("read", () => {
    test("get a card", async () => {
      const c = await newCard();
      const res = await request(app)
        .get(API_ENDPOINTS.CARDS.GET(c.id))
        .expect(200);

      expect(res.body).toMatchObject(c);
    });
  });

  describe("update", () => {
    test("updates no fields", async () => {
      const c = await newCard();

      const newFields = {} as UpdateCardRequest;

      const res = await request(app)
        .put(API_ENDPOINTS.CARDS.UPDATE(c.id))
        .send(newFields)
        .expect(200);

      expect(res.body).toMatchObject(c);
    });

    test("updates all fields", async () => {
      const c = await newCard();

      const newFields = {
        name: "new card name",
        description: "new card description",
        priority: "high",
        labels: ["n1", "n2"],
      } as UpdateCardRequest;

      const res = await request(app)
        .put(API_ENDPOINTS.CARDS.UPDATE(c.id))
        .send(newFields)
        .expect(200);

      expect(res.body).toMatchObject(newFields);
    });
  });

  describe("move", () => {
    test("updates all fields", async () => {
      const c = await newCard();

      const newCol = await newColumn();

      const newFields = {
        column_id: newCol.id,
      } as MoveCardRequest;

      const res = await request(app)
        .put(API_ENDPOINTS.CARDS.MOVE(c.id))
        .send(newFields)
        .expect(200);

      expect(res.body).toMatchObject(newFields);
    });
  });

  describe("delete", () => {
    test("deletes a card", async () => {
      const c = await newCard();

      const res = await request(app)
        .delete(API_ENDPOINTS.CARDS.DELETE(c.id))
        .expect(200);
      expect(res.body).toEqual({});

      await request(app).get(API_ENDPOINTS.CARDS.GET(c.id)).expect(404);
    });
  });

  describe("subtasks", () => {
    test("create", async () => {
      const c = await newCard();

      const task = {
        card_id: c.id,
        name: "sub1",
      } as Subtask;

      const res = await request(app)
        .post(API_ENDPOINTS.SUBTASKS.CREATE(c.id))
        .send(task)
        .expect(200);
      expect(res.body).toMatchObject(task);

      const cardRes = await request(app)
        .get(API_ENDPOINTS.CARDS.GET(c.id))
        .send(task)
        .expect(200);
      expect(cardRes.body).toMatchObject({
        subtasks: [task],
      } as Card);
    });

    test("update", async () => {
      const c = await newCard();

      let task = {
        card_id: c.id,
        name: "sub1",
      } as Subtask;

      {
        const res = await request(app)
          .post(API_ENDPOINTS.SUBTASKS.CREATE(c.id))
          .send(task)
          .expect(200);
        expect(res.body).toMatchObject(task);
        task = res.body;
      }

      {
        const newFields = {} as UpdateSubtaskRequest;
        const res = await request(app)
          .put(API_ENDPOINTS.SUBTASKS.UPDATE(c.id, task.id))
          .send(newFields)
          .expect(200);
        expect(res.body).toMatchObject(task);
        task = res.body;
      }

      {
        const newFields = {
          completed: true,
          name: "newsub",
        } as UpdateSubtaskRequest;
        const res = await request(app)
          .put(API_ENDPOINTS.SUBTASKS.UPDATE(c.id, task.id))
          .send(newFields)
          .expect(200);
        expect(res.body).toMatchObject(newFields);
        task = res.body;
      }

      {
        const cardRes = await request(app)
          .get(API_ENDPOINTS.CARDS.GET(c.id))
          .send(task)
          .expect(200);
        expect(cardRes.body).toMatchObject({
          subtasks: [task],
        } as Card);
      }
    });

    test("delete", async () => {
      const c = await newCard();

      let task = {
        card_id: c.id,
        name: "sub1",
      } as Subtask;

      const res = await request(app)
        .post(API_ENDPOINTS.SUBTASKS.CREATE(c.id))
        .send(task)
        .expect(200);
      expect(res.body).toMatchObject(task);
      task = res.body;

      const delRes = await request(app)
        .del(API_ENDPOINTS.SUBTASKS.DELETE(c.id, task.id))
        .send(task)
        .expect(200);
      expect(delRes.body).toEqual({});

      const cardRes = await request(app)
        .get(API_ENDPOINTS.CARDS.GET(c.id))
        .send(task)
        .expect(200);
      expect(cardRes.body).toMatchObject({
        subtasks: [],
      } as Card);
    });
  });
});
