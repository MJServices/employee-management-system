import { Router } from "express";
import { checkUserRole, createUser, getAllUsers, loginUser, logoutUser } from "../controllers/user.controller.js";
import verifyRole from "../middlewares/verifyRole.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/checkRole").get(checkUserRole);
router.route("/logout").get(logoutUser);
router.route("/login").post(loginUser);
router.route("/create").post(
    verifyRole,
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    createUser
);
router.route("/getAll").get(verifyRole, getAllUsers);
const userRouter = router;

export default userRouter;