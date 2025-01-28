import { ApiResponse } from "../utils/apiResponse.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError.ts";
import { User } from "../models/user.model.ts";

export const saveTime = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const { timeRemaining } = req.body;
    console.log(id, timeRemaining);
    if (!id || !timeRemaining) {
      throw new ApiError(400, "Missing required fields");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.timeRemaining = timeRemaining;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "successfully time saved"));
  } catch (error: any) {
    throw new ApiError(error.status, error.message);
  }
});

export const getTime = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    console.log(id);
    if (!id) {
      throw new ApiError(400, "Missing required fields");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "successfully time fetched"));
  } catch (error: any) {
    throw new ApiError(error.status, error.message);
  }
});

export const endTime = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    console.log(id, "hey");
    if (!id) {
      throw new ApiError(400, "Missing required fields");
    }
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    user.timeRemaining = "0";
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "successfully time saved"));
  } catch (error: any) {
    throw new ApiError(error.status, error.message);
  }
});

export const getAllProgress = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const data = await User.find({ role: { $ne: "admin" } });
      const allProgress = data.map((user: any) => {
        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          progress: user.timeRemaining,
        };
      });
      return res
        .status(200)
        .json(
          new ApiResponse(200, allProgress, "Progress retrieved successfully")
        );
    } catch (error) {
      throw new ApiError(500, "Something went wrong");
    }
  }
);

export const resetTime = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (id) {
      const user = await User.findByIdAndUpdate(id, { timeRemaining: "28800" });
      if (!user) {
        throw new ApiError(404, "User not found");
      }
      user.timeRemaining = "28800";
      const updatedUser = await user.save();

      return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Successfully time saved"));
    } else {
      const updatedUsers = await User.updateMany(
        { role: { $ne: "admin" } },
        { $set: { timeRemaining: "28800" } }
      );

      const data = await User.find({ role: { $ne: "admin" } });
      const allProgress = data.map((user: any) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        progress: user.timeRemaining,
      }));

      return res
        .status(200)
        .json(
          new ApiResponse(200, allProgress, "Progress updated successfully")
        );
    }
  } catch (error: any) {
    throw new ApiError(error.status, error.message);
  }
});
