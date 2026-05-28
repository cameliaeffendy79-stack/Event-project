//kegunaan nya untuk proteksi setiap error agar tidak bisa terdeteksi
// letakkan di bagian services
// paling penting di bagian update, create, deleted

import { Prisma } from "@prisma/client";
import { AppError } from "./appError";

export function handlePrismaError(error:unknown){
    if(error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "p2025" :
            throw new AppError("Article not found" , 404) ;
            case "p2002":
                throw new AppError("Duplicate data", 400);
            default:
                throw new AppError("Database error", 500);
        }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        throw new AppError("Invalid input data, 400");
    }

    throw new AppError("Internal server error", 500);
}