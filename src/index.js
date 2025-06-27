import app from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 4000;

// db connection
dbConnect()
  .then(
    app.listen(PORT,() => {
      console.log(`Server is running at PORT: ${PORT}`);
    }),
  )
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });
