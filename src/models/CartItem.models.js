import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    deletedAt: {
      type: Date,
    }
  },
  { timestamps: true },
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
