import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./config";
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router";
import propertyRouter from "./routers/property.router";
import orderRouter from "./routers/order.router";

const port = PORT || 8080;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(helmet());
app.use(express.json());

// Health check
app.get("/api", (req: Request, res: Response) => {
  res.send("API is running");
});

// END POINT
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter); // ditambah oleh Nurbani
app.use("/api/properties", propertyRouter);

// ERROR MIDDLEWARE
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
