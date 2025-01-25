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

    return res.status(200).json(new ApiResponse(200, user, "successfully time saved"));
  } catch (error: any) {
    throw new ApiError(error.status, error.message);
  }
});

export const getTime = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.query;
        console.log(id)
        if (!id) {
          throw new ApiError(400, "Missing required fields");
        }
        const user = await User.findById(id);
        if (!user) {
          throw new ApiError(404, "User not found");
        }
        return res.status(200).json(new ApiResponse(200, user, "successfully time fetched"));
      } catch (error: any) {
        throw new ApiError(error.status, error.message);
      }
});
