import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

const tempDir = path.join(process.cwd(), "public", "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// middleware
cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import authRouter from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import orderRoutes from "./routes/order.routes.js";

// custom routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/rview", reviewRoutes);
app.use("/api/v1/o", orderRoutes);

app.get("/test", (req, res) => {
  console.log("hello test");
  return res.send("hello");
});

export default app;
