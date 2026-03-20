// Import Express
import express, { Handler, Request, Response } from "express";

import { router } from "./routes/routes";
import { APIError } from "../../shared/types/errors";

export const app = express();

// enable json for basic curl and properly marked json requests
app.use(
  express.json({
    type: [
      "",
      "application/json",
      "application/x-www-form-urlencoded", // default for curl -d 'JSON_STRING'
    ],
  })
);

// CORS Headers
//   - lazy * values since this is just a sample project
app.use((_request: Request, response: Response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  response.setHeader("Access-Control-Max-Age", "86400");
  next();
});

// require a body for post endpoints
app.use((request: Request, response: Response, next) => {
  if (request.method === "POST" && !request.body)
    return response.sendStatus(400);

  next();
});

app.use(router);

app.use((error: any, _request: Request, response: Response, _next: Handler) => {
  if (error instanceof APIError) {
    response.status(error.code).json({ error: error.message });
  } else if (error.code === "23505") {
    // Unique constraint violation
    response.status(409).json({ error: "Already Exists" });
  } else {
    console.log("Unexpected error in request:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});
