import request from "supertest";
import { app } from "../app";
import { Board, ListBoardsResponse } from "../../../shared/types/boards";
import { API_ENDPOINTS } from "../../../shared/types/server";

describe("Boards API", () => {
  let board: Board;

  const ensureBoard = async () => {
    if (board) return board;

    const res = await request(app)
      .post(API_ENDPOINTS.BOARDS.CREATE)
      .send({
        name: "test board",
        description: "test board descr",
      } as Board);

    board = res.body;
    return board;
  };

  afterAll(async () => {
    if (board?.id) {
      await request(app).delete(API_ENDPOINTS.BOARDS.DELETE(board.id));
    }
  });

  describe("create", () => {
    test("creates a board", async () => {
      const b = await ensureBoard();
      expect(b).toMatchObject({
        name: "test board",
        description: "test board descr",
      });
    });
  });

  describe("get", () => {
    test("gets an existing board", async () => {
      const b = await ensureBoard();

      const res = await request(app)
        .get(API_ENDPOINTS.BOARDS.GET(b.id))
        .expect(200);

      expect(res.body).toMatchObject(b);
    });

    test("returns 404 for a bad id", async () => {
      await request(app)
        .get(API_ENDPOINTS.BOARDS.GET("d78853f2-bdd5-4e0a-9c30-b4f4eee231c3"))
        .expect(404);
    });
  });

  describe("list", () => {
    test("includes the created board", async () => {
      const b = await ensureBoard();
      const res = await request(app).get(API_ENDPOINTS.BOARDS.LIST).expect(200);

      const listResp = res.body as ListBoardsResponse;

      expect(listResp.boards).toContainEqual(
        expect.objectContaining({
          id: b.id,
        })
      );
    });
  });

  describe("update", () => {
    test("updates no board fields", async () => {
      const b = await ensureBoard();

      const res = await request(app)
        .put(API_ENDPOINTS.BOARDS.UPDATE(b.id))
        .send({})
        .expect(200);

      expect(res.body).toMatchObject(b);
      board = res.body;
    });

    test("updates all board fields", async () => {
      const b = await ensureBoard();
      const newFields = {
        name: "new test board",
        description: "new test board descr",
      } as Board;

      const res = await request(app)
        .put(API_ENDPOINTS.BOARDS.UPDATE(b.id))
        .send(newFields)
        .expect(200);

      expect(res.body).toMatchObject(newFields);
      board = res.body;
    });
  });

  describe("delete", () => {
    test("deletes a board", async () => {
      const createRes = await request(app)
        .post(API_ENDPOINTS.BOARDS.CREATE)
        .send({
          name: "delete test board",
          description: "delete test board descr",
        } as Board);

      const b = createRes.body as Board;

      await request(app).delete(API_ENDPOINTS.BOARDS.DELETE(b.id)).expect(204);
      await request(app).get(API_ENDPOINTS.BOARDS.GET(b.id)).expect(404);
    });
  });
});
