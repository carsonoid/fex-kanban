import { Column } from "./columns";

export interface Board {
  id: string;
  name: string;
  description: string;
  created_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
  updated_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
  user_id: string;
}

export interface BoardWithColumns extends Board {
  columns: Column[];
}

// CreateBoardRequest returns Board
export interface CreateBoardRequest {
  name: string;
  description: string;
}

// ListBoardsRequest returns ListBoardsResponse
export interface ListBoardsRequest {}

export interface ListBoardsResponse {
  boards: Board[];
}

// UpdateBoardRequest returns Board
export interface UpdateBoardRequest {
  name: string;
  description: string;
}

export interface DeleteBoardResponse {}
