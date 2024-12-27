import { Request, Response } from "express"


const asyncHandler = (fn: (req: Request, res: Response, next: any)=>{}) => async (req: Request, res: Response, next: any) => {
    try {
        await fn(req, res, next)
    } catch (error: any) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export default asyncHandler