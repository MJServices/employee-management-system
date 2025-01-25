import { Router } from "express";
import { endTime, getTime, saveTime } from "../controllers/timer.controller.ts";

const router = Router();


router.route("/save").post(saveTime);
router.route("/get").post(getTime)
router.route("/complete").post(endTime)

const timerRouter = router;
export default timerRouter;