 import mongoose, { Schema, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

interface IUser extends Document {
 _id: string;
  role: string;
  username: string;
  email: string;
  todayTasks: Array<mongoose.Types.ObjectId>;
  avatar: string;
  coverImage?: string;
  history: mongoose.Types.ObjectId[];
  password: string;
  refreshToken?: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    role: {
        type: String,
        default: "Employee"
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    todayTasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (this: IUser): string {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};


export const User = mongoose.model<IUser>("User", userSchema);