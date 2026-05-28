import { Request, Response, NextFunction } from "express";

export function loggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const start = Date.now()

    const localTime = new Date().toLocaleString("id-ID", {
        timeZone:"Asia/Jakarta",
    });

    res.on("finish", () => {
        const latency = Date.now() - start;
        const isSuccess = res.statusCode < 400;
        const statusMessage = isSuccess ? "SUCCESS" : "FAILED"
    });
} 

//lalu buatkan console log nya dari chat gpt , dan masukkan di entry point nya (APP.ts)