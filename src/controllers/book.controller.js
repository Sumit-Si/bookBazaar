import Book from "../models/Book.models.js";

const addBook = async (req, res) => {
  const { title, description, author, genre, price, stock } = req.body;
  const userId = req?.user?.id;

  try {
    // check existing data
    const existingBook = await Book.findOne({
      title,
    });

    if (existingBook) {
      return res.status(404).json({
        error: "Book already exist",
      });
    }

    const book = await Book.create({
      title,
      description,
      author,
      price,
      stock,
      genre,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
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

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();

    res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
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
      error,
    });
  }
};

const updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, description, price, stock } = req.body;

  try {
    const existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        error: "Book not found",
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
    ).populate("createdBy", "username fullName");

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
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
