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
        },
        priceAtPurchase: {
            type: Number,
            required: true,
        }
      }, 
    ],
    totalAmount: {
        type: Number,
        default: 0,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending","paid","shipped","cancelled"],
        default: "pending",
    }
  },
  { timestamps: true },
);


const Order = mongoose.model("Order",orderSchema);

export default Order;
