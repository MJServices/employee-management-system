import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt, { JwtPayload } from "jsonwebtoken";

interface decodeI extends JwtPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}
const generateRefereshTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    await user?.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body || {};
  if (!email && !username && !password && !role) {
    console.warn("No user details received in request body");
  }
  if (!username && !email) {
    throw new ApiError(400, "username or email is  required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  if (role) {
    if (role === "admin" || role === "manager") {
      const { accessToken } = await generateRefereshTokens(user._id);

      const loggedInUser = await User.findById(user._id).select("-password");
      console.log(loggedInUser);
      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
            },
            "User logged In Successfully"
          )
        );
    } else {
      const { accessToken } = await generateRefereshTokens(user._id);

      const loggedInUser = await User.findById(user._id).select("-password");

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
          new ApiResponse(
            200,
            {
              user: loggedInUser,
              accessToken,
            },
            "User logged In Successfully"
          )
        );
    }
  }
});

interface MulterRequest extends Request {
  files: {
    avatar?: Express.Multer.File[];
    coverImage?: Express.Multer.File[];
  };
}

export const createUser = asyncHandler(async (_: Request, res: Response) => {
  const req = _ as MulterRequest;
  const avatarLocalPath = await req.files?.avatar?.[0]?.path;
  console.log(avatarLocalPath);
  const coverImageLocalPath = await req.files?.coverImage?.[0]?.path;
  console.log(coverImageLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const { email, username, password, role } = req.body;
  console.log(email, username, password, role);
  if (!email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email) {
    throw new ApiError(400, "Invalid email format");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }
  if (!avatar) {
    throw new ApiError(400, "Avatar file upload failed");
  }

  if (role) {
    if (role === "admin" || role === "manager") {
      const user = await User.create({
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        role,
      });
      const createdUser = await User.findById(user._id).select("-password");

      if (!createdUser) {
        throw new ApiError(
          500,
          "Something went wrong while registering the user"
        );
      }

      return res
        .status(201)
        .json(
          new ApiResponse(200, createdUser, "User registered successfully")
        );
    } else {
      const user = await User.create({
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
      });
      const createdUser = await User.findById(user._id).select("-password");

      if (!createdUser) {
        throw new ApiError(
          500,
          "Something went wrong while registering the user"
        );
      }

      return res
        .status(201)
        .json(
          new ApiResponse(200, createdUser, "User registered successfully")
        );
    }
  }
});

interface userI extends Request {
  user: {
    _id: string;
    email: string;
    username: string;
    role?: string;
  };
}

export const logoutUser = asyncHandler(async (_, res) => {
  const req = _ as userI;
  console.log(req.body);
  const cookie = req.cookies.accessToken;
  const decoded: decodeI = jwt.verify(
    cookie,
    process.env.ACCESS_TOKEN_SECRET!
  ) as decodeI;
  const user = await User.findByIdAndUpdate(decoded._id, {
    new: true,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { user }, "User logged Out"));
});

export const getUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const {_id} = await req.body
    const user = await User.find({_id: {$in: _id}});
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { user }, "User details retrieved successfully")
      );
  }
);

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const allUser = await User.find({});
    return res
      .status(200)
      .json(new ApiResponse(200, allUser, "User retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

export const getUserFromCookie = asyncHandler(async (req: Request, res: Response) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new ApiError(401, "No token provided");
    }
    const decoded = (await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    )) as { _id: string; role: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { user }, "User details retrieved successfully"));
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});
