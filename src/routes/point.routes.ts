import { Router }
from "express";

import { authMiddleware }
from "../middlewares/auth.middleware";

import {
  getMyPoints,
} from "../controllers/point.controller";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  getMyPoints
);

export default router;