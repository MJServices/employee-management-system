import * as dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from './app.js';

const result = dotenv.config();
if (!result) console.error("Error loading .env file");

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.error("MONGO db connection failed !!! ", err);
        process.exit(1);
    });