import { Card } from "./cards";

export interface Column {
  id: string;
  board_id: string;
  name: string;
  order: number;
  wip_limit: number;
  created_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
}

export interface ColumnWithCards {
  column: Column;
  cards: Card[];
}

// UpdateColumnRequest returns Column
export interface UpdateColumnRequest {
  name: string;
  wip_limit: number;
}
