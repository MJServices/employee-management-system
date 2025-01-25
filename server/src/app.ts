import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.router.ts"
import taskRouter from "./routes/task.router.js";
import timerRouter from "./routes/timer.router.ts";

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user/", userRouter)
app.use("/api/v1/tasks/", taskRouter);
app.use("/api/v1/timer/", timerRouter);

export {app}