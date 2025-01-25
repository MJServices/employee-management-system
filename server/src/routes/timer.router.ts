import { Router } from "express";
import { getTime, saveTime } from "../controllers/timer.controller.ts";

const router = Router();


router.route("/save").post(saveTime);
router.route("/get").post(getTime)

const timerRouter = router;
export default timerRouter;