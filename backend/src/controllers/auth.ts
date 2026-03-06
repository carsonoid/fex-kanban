import { Request, Response } from "express";

import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RefreshRequest,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from "../../../shared/types/auth";

export const register = (request: Request, response: Response) => {
  const req: RegisterRequest = request.body;

  const id = crypto.randomUUID();

  const res: RegisterResponse = {
    user: {
      id: id,
      name: req.name,
      created_at: new Date().toISOString(),
      email: req.email,
    },
  };
  response.json(res);
};

export const login = (request: Request, response: Response) => {
  const req: LoginRequest = request.body;

  const res: LoginResponse = {
    access_token: "123", // TODO: JWT or shared token
    expires_in: 0,
  };
  response.json(res);
};

export const refresh = (request: Request, response: Response) => {
  const req: RefreshRequest = request.body;

  const res: RefreshResponse = {
    access_token: "",
    expires_in: 0,
  };
  response.json(res);
};

export const logout = (request: Request, response: Response) => {
  const req: LogoutRequest = request.body;

  const res: LogoutResponse = {
    success: true,
  };
  response.json(res);
};
