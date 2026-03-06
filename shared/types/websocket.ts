import { Card } from "./cards";
import { Board } from "./boards";

export enum EventType {
  EVENT_TYPE_UNSPECIFIED = 0,
  CARD_CREATED = 1,
  CARD_UPDATED = 2,
  CARD_DELETED = 3,
  CARD_MOVED = 4,
  BOARD_UPDATED = 5,
  USER_JOINED = 6,
  USER_LEFT = 7,
}

export interface UserPresence {
  user_id: string;
  name: string;
  joined_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
}

export interface WebSocketMessage {
  type: EventType;
  timestamp: string; // ISO 8601: "2026-02-15T10:30:00Z"
  user_id: string;
  board_id: string;
  payload?: {
    card?: Card;
    board?: Board;
    user_presence?: UserPresence;
  };
}
