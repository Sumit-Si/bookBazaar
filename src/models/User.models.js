import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://placehold.co/600x400`,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      default: "user",
      type: String,
      enum: ["user", "admin"],
    },
    refreshToken: {
      type: String,
    }
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// custome methods
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({_id: this._id,email: this.email},
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({_id: this._id,email: this.email},
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

// model
const User = mongoose.model("User", userSchema);

export default User;
