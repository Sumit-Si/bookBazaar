import Book from "../models/Book.models.js";
import CartItem from "../models/CartItem.models.js";
import Order from "../models/Order.models.js";

const addOrder = async (req, res) => {
  const { address } = req.body;
  const userId = req.user?._id;

  try {
    const cartItems = await CartItem.find({
      user: userId,
      deletedAt: null,
    }).populate("book", "title price stock quantity");

    if (!cartItems || cartItems?.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderData = [];

    // const orderData = items.map(item => {
    //     const book = await Book.findById()
    // })   // foreach isn't working as await have to be declare top level

    for (const item of cartItems) {
      if (!item.book) {
        return res.status(404).json({
          message: "Book not found",
        });
      }

      if (item.book.stock < item.quantity) {
        return res.status(400).json({
          message: `Out of stock ${item.book.title}`,
        });
      }

      const price = item.book.price;
      totalAmount += price * item.quantity;

      orderData.push({
        book: item.book._id,
        quantity: item.quantity,
        priceAtPurchase: price,
      });
    }

    // TODO:decrease stock count

    const order = await Order.create({
      user: userId,
      address,
      items: orderData,
      totalAmount,
    });

    // if(!order) {
    //     return res.status(400).json({
    //         error: "Problem when creating order"
    //     })
    // }            // not necessary as Order.create throws an error if something goes wrong (e.g., validation fails) and catch will throw an error


    if (!order) {
      res.status(500).json({
        message: "Problem while creating order",
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    if (page <= 0) page = 1;
    if (limit <= 0 || limit >= 50) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find({
      user: req.user?._id,
    })
      .populate("user", "username fullName avatar")
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({
      user: req.user?._id,
    });
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
      metadata: {
        totalPages,
        currentPage: page,
        currentLimit: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const orderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate(
      "user",
      "username fullName avatar",
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { addOrder, getOrders, orderDetails };
