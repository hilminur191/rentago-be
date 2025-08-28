import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { ZodError } from "zod";
import { PORT } from "./config";

// ROUTER
///
///

const port = PORT || 8080;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.send("API is running");
});

// END POINT
///
///

// ERROR MIDDLEWARE

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
