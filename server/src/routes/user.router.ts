import { Router } from "express";
import { createUser, getAllUsers, getUserById, getUserFromCookie, loginUser, logoutUser } from "../controllers/user.controller.js";
import verifyRole from "../middlewares/verifyRole.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/getuser").post(getUserById);
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
router.route("/getcookie").get(getUserFromCookie)
const userRouter = router;

export default userRouter;