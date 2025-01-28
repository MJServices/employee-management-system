import { Router } from "express";
import { endTime, getAllProgress, getTime, resetTime, saveTime } from "../controllers/timer.controller.ts";

const router = Router();


router.route("/save").post(saveTime);
router.route("/get").post(getTime)
router.route("/complete").post(endTime)
router.route("/getAll").get(getAllProgress)
router.route("/reset").patch(resetTime)

const timerRouter = router;
export default timerRouter;