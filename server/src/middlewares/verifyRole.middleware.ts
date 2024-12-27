import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/apiError.ts";

const verifyRole = async (req: Request, res: Response, next: NextFunction) => {
    console.log("hey")
    const token = req.cookies.accessToken;
    if (!token) {
        throw new ApiError(401, "No token provided");
    }

    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { _id: string, role: string };
        const user = await User.findById(decoded._id);
        
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        
        if (user.role !== "admin") {
            throw new ApiError(403, "You are not authorized");
        }
        
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
};

export default verifyRole;