import express from "express";

import { API_ENDPOINTS } from "../../../shared/types/server";
import * as authController from "../controllers/auth";
import * as boardController from "../controllers/boards";
import * as columnController from "../controllers/columns";
import * as cardController from "../controllers/cards";
import * as subtasksController from "../controllers/card_subtasks";

const r = express.Router();

r.post(API_ENDPOINTS.AUTH.REGISTER, authController.register);
r.post(API_ENDPOINTS.AUTH.LOGIN, authController.login);
r.post(API_ENDPOINTS.AUTH.REFRESH, authController.refresh);
r.post(API_ENDPOINTS.AUTH.LOGOUT, authController.logout);

r.post(API_ENDPOINTS.BOARDS.CREATE, boardController.create);
r.post(API_ENDPOINTS.BOARDS.CREATE_ID(":id"), boardController.create);
r.get(API_ENDPOINTS.BOARDS.GET(":id"), boardController.get);
r.get(API_ENDPOINTS.BOARDS.LIST, boardController.list);
r.put(API_ENDPOINTS.BOARDS.UPDATE(":id"), boardController.update);
r.delete(API_ENDPOINTS.BOARDS.DELETE(":id"), boardController.del);

r.post(API_ENDPOINTS.COLUMNS.CREATE(":board_id"), columnController.create);
r.post(
  API_ENDPOINTS.COLUMNS.CREATE_ID(":board_id", ":id"),
  columnController.create
);
r.put(
  API_ENDPOINTS.COLUMNS.UPDATE(":board_id", ":id"),
  columnController.update
);
r.delete(
  API_ENDPOINTS.COLUMNS.DELETE(":board_id", ":id"),
  columnController.del
);

r.post(API_ENDPOINTS.CARDS.CREATE, cardController.create);
r.post(API_ENDPOINTS.CARDS.CREATE_ID(":id"), cardController.create);
r.get(API_ENDPOINTS.CARDS.GET(":id"), cardController.get);
r.put(API_ENDPOINTS.CARDS.UPDATE(":id"), cardController.update);
r.put(API_ENDPOINTS.CARDS.MOVE(":id"), cardController.move);
r.delete(API_ENDPOINTS.CARDS.DELETE(":id"), cardController.del);

r.post(API_ENDPOINTS.SUBTASKS.CREATE(":card_id"), subtasksController.create);
r.post(
  API_ENDPOINTS.SUBTASKS.CREATE_ID(":card_id", ":id"),
  subtasksController.create
);
r.put(
  API_ENDPOINTS.SUBTASKS.UPDATE(":card_id", ":id"),
  subtasksController.update
);
r.delete(
  API_ENDPOINTS.SUBTASKS.DELETE(":card_id", ":id"),
  subtasksController.del
);

export const router = r;
