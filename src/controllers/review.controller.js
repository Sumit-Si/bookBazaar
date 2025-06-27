import Review from "../models/Review.models.js";
import Book from "../models/Book.models.js";

const addReview = async (req, res) => {
  const {rating,comment} = req.body;
  const {bookId} = req.params;
  const userId = req?.user?.id;

  try {
    // check book exist
    const book = await Book.findById(bookId);

    if(!book) {
        return res.status(404).json({
            error: "Book not found",
        })
    }

    // check existing review of a user for a book
    const existingReview = await Review.findOne({
        book: bookId,
        createdBy: userId
    })

    if(existingReview) {
        return res.status(400).json({
            error: "Review already exist",
        })
    }

    // create review
    const review = await Review.create({
        book: bookId,
        comment,
        rating,
        createdBy: userId
    });

    await review.save();

    res.status(201).json({
        success: true,
        message: "Review created successfully",
        review,
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const {bookId} = req.params;
    
    const reviews = await Review.find({
        book: bookId,
    });

    if(!reviews) {
        return res.status(404).json({
            error: "Reviews not found",
        })
    }

    res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        reviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndDelete(id);

    if(!review) {
        return res.status(404).json({
            error: "Review not found",
        })
    }

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export { addReview, getReviews, deleteReview };
