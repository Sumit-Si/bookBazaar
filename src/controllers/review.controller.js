import Review from "../models/Review.models.js";
import Book from "../models/Book.models.js";

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const { bookId } = req.params;
  const userId = req.user?._id;

  try {
    // check book exist
    const book = await Book.findOne({
      _id: bookId,
      deletedAt: null,
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // check existing review
    const existingReview = await Review.findOne({
      book: bookId,
      createdBy: userId,
      deletedAt: null,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Review already exist",
      });
    }

    // create review
    const review = await Review.create({
      book: bookId,
      comment,
      rating,
      createdBy: userId,
    });

    const createdReview = await Review.findById(review?._id)
      .populate("createdBy", "username fullName avatar")
      .populate("book", "title price author genre");

    if (!createdReview) {
      return res.status(500).json({
        message: "Problem while creating review",
      });
    }

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: createdReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    const { bookId } = req.params;

    if (page <= 0) page = 1;
    if (limit <= 0 || limit >= 50) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      book: bookId,
      deletedAt: null,
    })
      .populate("createdBy", "username fullName avatar")
      .populate("book", "title price author genre")
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({
      createdBy: req.user?._id,
    });
    const totalPages = Math.ceil(totalReviews / limit);

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
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

const deleteReview = async (req, res) => {
  const { id, bookId } = req.params;

  try {
    const existingReview = await Review.findOne({
      _id: id,
      book: bookId,
      deletedAt: null,
    });

    if (!existingReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true },
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export { addReview, getReviews, deleteReview };
