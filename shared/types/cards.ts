export interface Subtask {
  id: string;
  card_id: string;
  name: string;
  completed: boolean;
}

// UpdateSubtaskRequest
export interface UpdateSubtaskRequest {
  name: string;
  completed: boolean;
}

export interface Card {
  id: string;
  column_id: string;
  name: string;
  description: string;
  order: number;
  priority: string; // low, medium, high
  due_date: string; // ISO 8601: "2026-02-15T10:30:00Z"
  labels: string[];
  assignee: string;
  subtasks: Subtask[];
  created_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
  updated_at: string; // ISO 8601: "2026-02-15T10:30:00Z"
}

// UpdateCardRequest returns Card
export interface UpdateCardRequest {
  name: string;
  description: string;
  priority: string;
  due_date: string; // ISO 8601: "2026-02-15T10:30:00Z"
  labels: string[];
  assignee: string;
  subtasks: Subtask[];
}

// MoveCardRequest returns Card
export interface MoveCardRequest {
  column_id: string;
  order: number;
}
