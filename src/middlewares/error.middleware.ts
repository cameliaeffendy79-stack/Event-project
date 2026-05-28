import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export function errorMiddleware (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).send ({
            success: false,
            message:error.message,
        });
    }

    return res.status (500) .send ({
        success: false,
        message: "Internal server error",
    });
}

// kalau sudah menggunakan error.middleware maka res.status(500) sudh tidak perlu lagi, hanya perlu memanggil ,-
// NextFuntion untuk bagian error nya
// dan tambahkan errorMiddleware nya di bagian app.ts nya paling atas 