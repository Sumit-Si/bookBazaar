import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Who made the payment.
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    }, // Which order this payment relates to.
    amount: {
      type: Number,
      required: true,
    }, // Transaction amount for record.
    provider: {
      type: String,
    }, // e.g. 'mock-gateway', 'stripe', useful for integration.
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    }, // Payment flow status, helps in payment tracking.
    transactionId: {
      type: String,
      unique: true,
    }, // Reference for confirmations/support.
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
