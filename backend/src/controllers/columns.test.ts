import request from "supertest";
import { app } from "../app";
import { Board, BoardWithColumns } from "../../../shared/types/boards";
import { Column, UpdateColumnRequest } from "../../../shared/types/columns";
import { API_ENDPOINTS } from "../../../shared/types/server";

describe("Columns API", () => {
  let board: Board;
  let column: Column;

  const ensureBoard = async () => {
    if (board) return board;

    const res = await request(app).post("/api/boards").send({
      name: "test board",
      description: "test board descr",
    });
    board = res.body;
    return board;
  };

  const ensureColumn = async () => {
    ensureBoard();

    if (column) return column;

    const b = await ensureBoard();
    const res = await request(app)
      .post(`/api/boards/${b.id}/columns`)
      .send({ board_id: b.id, name: "test column" });
    column = res.body;
    return column;
  };

  afterAll(async () => {
    if (board.id) {
      await request(app).delete(`/api/boards/${board.id}`);
    }
  });

  describe("create", () => {
    test("creates a column", async () => {
      const b = await ensureBoard();
      const res = await request(app)
        .post(API_ENDPOINTS.COLUMNS.CREATE(b.id))
        .send({ board_id: b.id, name: "new column" } as Column)
        .expect(201);

      expect(res.body).toMatchObject({ board_id: b.id, name: "new column" });
    });
  });

  describe("get", () => {
    test("gets a board to check columns", async () => {
      const c = await ensureColumn();
      const res = await request(app)
        .get(API_ENDPOINTS.BOARDS.GET(c.board_id))
        .expect(200);

      const b = res.body as BoardWithColumns;

      expect(b.columns).toContainEqual(expect.objectContaining(c));
    });
  });

  describe("update", () => {
    test("updates none", async () => {
      const c = await ensureColumn();

      const newFields = {} as UpdateColumnRequest;

      const res = await request(app)
        .put(`/api/boards/${c.board_id}/columns/${c.id}`)
        .send(newFields)
        .expect(200);

      expect(res.body).toMatchObject(c);
    });

    test("updates all", async () => {
      const c = await ensureColumn();

      const newFields = {
        name: "new column name",
        wip_limit: 10,
      } as UpdateColumnRequest;

      const res = await request(app)
        .put(`/api/boards/${c.board_id}/columns/${c.id}`)
        .send(newFields)
        .expect(200);

      expect(res.body).toMatchObject(newFields);
    });
  });

  describe("delete", () => {
    test("delete a column", async () => {
      const c = await ensureColumn();

      const res = await request(app)
        .delete(`/api/boards/${c.board_id}/columns/${c.id}`)
        .expect(204);
    });
  });
});
