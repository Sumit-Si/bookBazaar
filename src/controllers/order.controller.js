import Book from "../models/Book.models.js";
import Order from "../models/Order.models.js";

const addOrder = async (req, res) => {
  const { items } = req.body;
  console.log(items, "items");

  try {
    const userId = req?.user?.id;

    // check items an array or not
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(404).json({
        error: "Order items not found",
      });
    }
    let totalAmount = 0;
    const orderData = [];

    // const orderData = items.map(item => {
    //     const book = await Book.findById()
    // })   // foreach isn't working as await have to be declare top level

    for (const item of items) {
      const book = await Book.findById(item?.book);
      console.log(book, "book");

      if (!book || book.stock < item.quantity) {
        return res.status(400).json({
          error: `Book unavailable or out of stock ${item?.book}`,
        });
      }

      const price = book?.price;
      totalAmount += price * item?.quantity;

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
      items: orderData,
      totalAmount,
    });

    // if(!order) {
    //     return res.status(400).json({
    //         error: "Problem when creating order"
    //     })
    // }            // not necessary as Order.create throws an error if something goes wrong (e.g., validation fails) and catch will throw an error

    res.status(201).json({
      success: true,
      message: "Order added successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    // if (orders.length === 0) {
    //   return res.status(404).json({
    //     error: "Orders not found",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const orderDetails = async (req, res) => {
  const { id } = req.params;
  console.log(typeof id, "orderId");

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
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
      error,
    });
  }
};

export { addOrder, getOrders, orderDetails };
