export class APIError {
  code: number;
  message: string;

  constructor(code: number, message: string) {
    this.code = code;
    this.message = message;
  }
}

export const ErrorNotFound = new APIError(404, "Not Found");
