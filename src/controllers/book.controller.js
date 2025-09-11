import Book from "../models/Book.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const addBook = async (req, res) => {
  const {
    title,
    description,
    author,
    genre,
    price,
    stock,
    ISBN,
    publisher,
    publishedDate,
  } = req.body;
  const userId = req.user?.id;

  try {
    // check existing data
    const existingBook = await Book.findOne({
      title,
      author,
      deletedAt: null,
    });

    if (existingBook) {
      return res.status(400).json({
        message: "Book already exist",
      });
    }

    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
      return res.status(400).json({
        message: "File uploads failed",
      });
    }

    let uploadResult;
    try {
      if (coverImageLocalPath)
        uploadResult = await uploadOnCloudinary(coverImageLocalPath);

      const book = await Book.create({
        title,
        description,
        author: author || userId,
        price,
        stock,
        genre,
        ISBN,
        coverImage: uploadResult ? uploadResult?.url : null,
        createdBy: userId,
        publisher,
        publishedDate,
      });

      const createdBook = await Book.findById(book?._id).populate(
        "createdBy",
        "username fullName avatar",
      );

      if (!createdBook) {
        return res.status(500).json({
          message: "Problem while creating book",
        });
      }

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        createdBook,
      });
    } catch (error) {
      if (coverImageLocalPath)
        await deleteFromCloudinary(uploadResult?.public_id);

      res.status(500).json({
        success: false,
        message: "Problem while creating book",
        error: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getBooks = async (req, res) => {
  try {
    let {
      limit = 10,
      page = 1,
      search,
      genre,
      author,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    if (page <= 0) page = 1;
    if (limit <= 0 || limit >= 50) {
      limit = 10;
    }

    const filter = {};

    if (genre) filter.genre = genre;
    if (author) filter.author = author;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = order === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const books = await Book.find({
      ...filter,
      publishedDate: {
        $ne: null,
      },
      deletedAt: {
        $eq: null,
      },
    })
      .populate("author", "username fullName avatar")
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder });

    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
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

const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findOne({
      _id: id,
      deletedAt: {
        $eq: null,
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, price, stock } = req.body;

  try {
    const existingBook = await Book.findOne({
      _id: id,
      deletedAt: {
        $eq: null,
      },
    });

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author,
        description,
        price,
        stock,
      },
      { new: true },
    ).populate("author", "username fullName");

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const existingBook = await Book.findOne({
      _id: id,
      deletedAt: {
        $eq: null,
      },
    });

    if (!existingBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const book = await Book.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    },{new: true});

    if (!book) {
      return res.status(500).json({
        success: false,
        message: "Problem while deleting book",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export { addBook, getBooks, getBookById, updateBookById, deleteBook };
