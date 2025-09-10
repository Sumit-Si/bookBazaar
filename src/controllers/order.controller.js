import Book from "../models/Book.models.js";
import Order from "../models/Order.models.js";

const addOrder = async (req, res) => {
  const { items, address } = req.body;
  console.log(items, "items");

  try {
    const userId = req.user?._id;

    // check items an array or not
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are missing",
      });
    }
    let totalAmount = 0;
    const orderData = [];

    // const orderData = items.map(item => {
    //     const book = await Book.findById()
    // })   // foreach isn't working as await have to be declare top level

    for (const item of items) {
      const book = await Book.findOne({
        _id: item?.book,
        deletedAt: {
          $ne: null,
        },
      });
      console.log(book, "book");

      if (!book) {
        return res.status(404).json({
          message: "Book unavailable",
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Out of stock ${book.title}`,
        });
      }

      const price = book.price;
      totalAmount += price * item.quantity;

      orderData.push({
        book: book._id,
        quantity: item.quantity,
        priceAtPurchase: price,
      });

      // decrease the book stock
      book.stock -= item.quantity;

      await book.save();
    }

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

    const createdOrder = await Order.findById(order?._id).populate(
      "user",
      "username fullName avatar",
    );

    if (!createdOrder) {
      res.status(500).json({
        message: "Problem while creating order",
      });
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      createdOrder,
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
      .populate("user","username fullName avatar")
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
    const order = await Order.findById(id)
      .populate("user","username fullName avatar");

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
