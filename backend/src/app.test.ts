import request from "supertest";
import { app } from "./app";
import { API_ENDPOINTS } from "../../shared/types/server";

describe("App Behaviors", () => {
  describe("post requires a body", () => {
    test("no body", async () => {
      const res = await request(app)
        .post(API_ENDPOINTS.CARDS.CREATE)
        .expect(400);
    });
  });
});
