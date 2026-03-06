import request from "supertest";
import { app } from "../app";
import { Board, ListBoardsResponse } from "../../../shared/types/boards";
import { API_ENDPOINTS } from "../../../shared/types/server";
import {
  LoginResponse,
  LogoutRequest,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from "../../../shared/types/auth";

describe("Auth API", () => {
  describe("Basic Flow", () => {
    test("register ", async () => {
      const createRes = await request(app)
        .post(API_ENDPOINTS.AUTH.REGISTER)
        .send({
          email: "test-user@test.com",
          name: "test user",
          password: "123",
        } as RegisterRequest);

      const registerResponse = createRes.body as RegisterResponse;

      expect(registerResponse.user.id).toBeTruthy;
      expect(registerResponse.user.created_at).toBeTruthy;
      expect(registerResponse).toMatchObject({
        user: {
          email: "test-user@test.com",
          name: "test user",
        } as unknown as User,
      } as RegisterResponse);

      {
        const loginResp = await request(app)
          .post(API_ENDPOINTS.AUTH.LOGIN)
          .send({
            name: "test user",
            password: "123",
          } as RegisterRequest);
        expect(loginResp.body).toMatchObject({
          access_token: "123",
        } as LoginResponse);
      }

      {
        const refreshResp = await request(app)
          .post(API_ENDPOINTS.AUTH.REFRESH)
          .send({} as RefreshRequest);
        expect(refreshResp.body).toMatchObject({} as RefreshResponse);
      }

      {
        const logoutResp = await request(app)
          .post(API_ENDPOINTS.AUTH.LOGOUT)
          .send({} as LogoutRequest);
        expect(logoutResp.body).toMatchObject({} as LoginResponse);
      }
    });
  });
});
