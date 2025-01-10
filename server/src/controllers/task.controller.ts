import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose, { Document } from "mongoose";

interface decodeI extends JwtPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface userI extends mongoose.Document {
  _id: string;
  email: string;
  username: string;
  role?: string;
  todayTasks: mongoose.Types.ObjectId[];
}

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, assignToAll, selectedUsers } =
    req.body;

  if (!title || !description || !dueDate) {
    throw new ApiError(400, "All fields are required");
  }

  let usersToAssign: userI[] = [];

  // Find users first
  if (assignToAll) {
    usersToAssign = await User.find({ role: { $ne: "admin" } });
  } else if (selectedUsers && selectedUsers.length > 0) {
    if (typeof selectedUsers[0] === "string") {
      const users = await User.find({ _id: { $in: selectedUsers } });
      if (!users || users.length === 0) {
        throw new ApiError(404, "Selected users not found");
      }
      usersToAssign = users;
    } else {
      usersToAssign = selectedUsers;
    }
  } else {
    throw new ApiError(400, "Please specify users to assign the task");
  }

  const coded = req.cookies.accessToken;
  const decoded: decodeI = jwt.verify(
    coded,
    process.env.ACCESS_TOKEN_SECRET!
  ) as decodeI;

  // Create task first
  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    assignedTo: usersToAssign,
    assignedBy: decoded._id,
  });

  await Promise.all(
    usersToAssign.map(async (user) => {
      user.todayTasks.push(task._id);
      await user.save();
    })
  );

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  const user = (await User.findById(id)) as userI;
  const tasks = await Promise.all(
    user.todayTasks.map(async (_id) => {
      const task = await Task.findById(_id)
        .populate("assignedTo", "username email")
        .populate("assignedBy", "username")
        .sort({ createdAt: -1 });
      if (!task) {
        throw new ApiError(404, "Task not found");
      }
      if (task.status) task.status = task.status;
      if (task.priority) task.priority = task.priority;
      if (task.dueDate) task.dueDate = task.dueDate;
      return task;
    })
  );
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

export const submitTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  const task = await Task.findById(id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const { status } = task;

  task.isCompleted = true;
  if (status) task.status = "COMPLETED";
  const cookie = req.cookies.accessToken;
  const decoded: decodeI = jwt.verify(
    cookie,
    process.env.ACCESS_TOKEN_SECRET!
  ) as decodeI;
  const user = await User.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.history.push(task._id);
  await user.save();
  await task.save();
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task isCompleted updated successfully"));
});

export const addTaskComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    task.comments.push({
      user: req.body._id,
      text,
    });
    await task.save();

    return res
      .status(200)
      .json(new ApiResponse(200, task, "Comment added successfully"));
  }
);

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();
    return res
      .status(200)
      .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }
})