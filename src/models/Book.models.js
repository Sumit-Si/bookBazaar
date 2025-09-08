import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      trim: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
