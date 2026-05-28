import {
  Request,
  Response,
} from "express";

import prisma
from "../prisma/client";

//////////////////////////////////////////////////
// ✅ GET MY POINTS
//////////////////////////////////////////////////
export const getMyPoints =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user =
        (req as any).user;

      const points =
        await prisma.points.findMany({
          where: {
            user_id: user.id,
          },

          orderBy: {
            created_at: "desc",
          },
        });

      const activePoints =
        points
          .filter(
            (p) =>
              !p.is_used &&
              p.expired_at &&
              p.expired_at >
                new Date()
          )
          .reduce(
            (total, point) =>
              total +
              (point.amount || 0),
            0
          );

      res.status(200).json({
        data: {
          activePoints,
          history: points,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  };