import Book from "../models/Book.models.js";
import CartItem from "../models/CartItem.models.js";

const addToCart = async (req, res) => {
  const { quantity, book } = req.body;
  const userId = req.user?._id;

  try {
    const existingBook = await Book.findOne({
      _id: book,
      deletedAt: null,
    });

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const exisitingCartItem = await CartItem.findOne({
      book,
      user: userId,
      deletedAt: null,
    });

    if (exisitingCartItem) {
      return res.status(400).json({
        message: "Cart item already exists",
      });
    }

    const cartItem = await CartItem.create({
      user: userId,
      book,
      quantity,
    });

    const createdCartItem = await CartItem.findById(cartItem?._id)
      .populate("user", "username fullName avatar")
      .populate("book", "title price stock");

    if (!createdCartItem) {
      return res.status(500).json({
        success: false,
        message: "Cart item already exists",
      });
    }

    res.status(201).json({
      success: true,
      message: "Cart item added successfully",
      cart: createdCartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCarts = async (req, res) => {
  const userId = req.user?._id;
  let { page = 1, limit = 10 } = req.query;

  try {
    if (page <= 0) page = 1;
    if (limit <= 0 || limit >= 50) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const carts = await CartItem.find({
      user: userId,
      deletedAt: null,
    })
      .populate("user", "username fullName avatar")
      .populate("book", "title price stock")
      .skip(skip)
      .limit(limit);

    const totalCartItems = await CartItem.countDocuments({
      user: userId,
      deletedAt: null,
    });
    const totalPages = Math.ceil(totalCartItems / limit);

    res.status(200).json({
      success: true,
      message: "Cart Items fetched successfully",
      carts,
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

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;

    const existing = await CartItem.findOne({
      _id: itemId,
      user: userId,
      deletedAt: null,
    });

    if (!existing) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const cartItem = await CartItem.findByIdAndUpdate(
      itemId,
      {
        quantity,
      },
      {
        new: true,
      },
    );

    if (!cartItem) {
      return res.status(500).json({
        success: false,
        message: "Problem while updating cartItem",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  const userId = req.user?._id;
  try {
    const { itemId } = req.params;

    const existing = await CartItem.findOne({
      _id: itemId,
      user: userId,
      deletedAt: null,
    });

    if (!existing) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const cartItem = await CartItem.findByIdAndUpdate(
      itemId,
      {
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!cartItem) {
      return res.status(500).json({
        success: false,
        message: "Problem while updating cartItem",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully",
      cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { addToCart, getCarts, updateCartItem, deleteCartItem };
