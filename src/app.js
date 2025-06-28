import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

import authRouter from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import orderRoutes from "./routes/order.routes.js";

// custom routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/book", bookRoutes);
app.use("/api/v1/rview", reviewRoutes);
app.use("/api/v1/o", orderRoutes);

app.get("/test", (req,res) => {
    console.log("hello test");
    return res.send("hello");
})

export default app;
