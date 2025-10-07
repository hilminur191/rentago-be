import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { PORT } from "./config";

// -------------------- ROUTERS --------------------
import userRouter from "./routers/user.router";
import authRouter from "./routers/auth.router";
import propertyRouter from "./routers/property.router";
import roomRouter from "./routers/room.router";
import dashboardRouter from "./routers/dashboard.router";
import roomAvailabilityRoutes from "./routers/availability.router";
import peakSeasonRateRoutes from "./routers/peakSeasonRate.router";

const app = express();
const port = PORT || 8080;

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(helmet());
app.use(express.json());

// -------------------- HEALTH CHECK --------------------
app.get("/api", (_req: Request, res: Response) => {
  res.send({ status: "ok", message: "API is running" });
});

// -------------------- ROUTES --------------------
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/filter", propertyRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/availability", roomAvailabilityRoutes);
app.use("/api/peak-season-rates", peakSeasonRateRoutes);

// -------------------- ERROR HANDLER --------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// -------------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});

export default app;
