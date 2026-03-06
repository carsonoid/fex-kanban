// Common response types
export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  code: number;
  message: string;
  details: string[];
}
