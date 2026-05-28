import { Router } from "express";
import {
  registerController,
  loginController,
  getMeController,
  updateProfileController,
  changePasswordController,
  deleteAccountController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createEvent } from "../controllers/event.controller";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, getMeController);                      
router.patch("/profile", authMiddleware, updateProfileController);       
router.patch("/change-password", authMiddleware, changePasswordController); 
router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccountController
);
router.post("/events", authMiddleware, createEvent);
export default router;  