import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.models.js";
import Order from "../models/Order.models.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { orderId, currency = "INR" } = req.body;

    const exisitingOrder = await Order.findById(orderId);

    if (!exisitingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const options = {
      amount: exisitingOrder.totalAmount * 100, // amount in paisa
      currency: "INR",
      receipt: `order_receipt_${orderId}`,
      notes: {
        orderId: orderId,
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      user: userId,
      order: orderId,
      amount: exisitingOrder.totalAmount,
      provider: "razorpay",
      currency: currency,
      status: "pending",
      transactionId: order.id,
    });

    if (!payment) {
      return res.status(500).json({
        message: "Problem while creating payment",
      });
    }

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const payment = await Payment.findOne({
      transactionId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }

    payment.status = "completed";
    await payment.save();

    const order = await Order.findById(payment?.order);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "paid";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { createRazorpayOrder, verifyPayment };
