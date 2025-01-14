import { Router } from "express";
import { createTask, getTasks, submitTask, addTaskComment, getAllTasks } from "../controllers/task.controller.js";
import verifyRole from "../middlewares/verifyRole.middleware.js";

const router = Router();

// Admin routes
router.route("/create").post(verifyRole, createTask);
router.route("/g").get(getTasks);
router.route("/getAll").get(verifyRole, getAllTasks);

// User routes
router.route("/submitTask").patch(submitTask);
// router.route("/comment/:taskId/").post(addTaskComment);

export default router;