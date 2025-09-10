import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        book: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped","delivered", "cancelled"],
      default: "pending",
    },
    address: {
      type: String,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    }
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
