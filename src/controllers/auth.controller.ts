import { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcrypt";

import {
  registerUser,
  loginUser as loginService,
} from "../services/auth.service";

import { sendWelcomeEmail } from "../templates/sendWelcomeEmail";

//////////////////////////////////////////////////
// ✅ REGISTER
//////////////////////////////////////////////////
export async function registerController(
  req: Request,
  res: Response
) {
  try {
    const result = await registerUser(
      req.body
    );
    await sendWelcomeEmail(
  result.email,
  result.name || "User"
);

    return res.status(201).json({
      message: "Register success",
      data: result,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message:
        error.message ||
        "Internal server error",
    });
  }
}

//////////////////////////////////////////////////
// ✅ LOGIN
//////////////////////////////////////////////////
export async function loginController(
  req: Request,
  res: Response
) {
  try {
    const result = await loginService(
      req.body
    );

    return res.status(200).json({
      message: "Login success",
      data: result,
    });
  } catch (error: any) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(400).json({
      message:
        error.message ||
        "Login failed",
    });
  }
}

//////////////////////////////////////////////////
// ✅ GET CURRENT USER
// GET /auth/me
//////////////////////////////////////////////////
export const getMeController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const user =
        await prisma.users.findUnique({
          where: {
            id: (req as any).user.id,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile_picture: true,
            referral_code: true,
            points_balance: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      return res.status(200).json({
        data: user,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

//////////////////////////////////////////////////
// ✅ UPDATE PROFILE
// PATCH /auth/profile
//////////////////////////////////////////////////
export const updateProfileController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const {
        name,
        profile_picture,
      } = req.body;

      const user =
        await prisma.users.update({
          where: {
            id: (req as any).user.id,
          },

          data: {
            ...(name && { name }),

            ...(profile_picture && {
              profile_picture,
            }),
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profile_picture: true,
            referral_code: true,
            points_balance: true,
          },
        });

      return res.status(200).json({
        message:
          "Profile updated successfully",

        data: user,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

//////////////////////////////////////////////////
// ✅ CHANGE PASSWORD
// PATCH /auth/change-password
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// ✅ CHANGE PASSWORD
// PATCH /auth/change-password
//////////////////////////////////////////////////
export const changePasswordController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const userId =
        (req as any).user.id;

      const {
        oldPassword,
        newPassword,
      } = req.body;

      // ✅ VALIDATION
      if (
        !oldPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "Old password and new password are required",
        });
      }

      // ✅ FIND USER
      const user =
        await prisma.users.findUnique({
          where: {
            id: userId,
          },
        });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // ✅ CHECK OLD PASSWORD
      const isPasswordValid =
        await bcrypt.compare(
          oldPassword,
          user.password
        );

      if (!isPasswordValid) {
        return res.status(400).json({
          message:
            "Old password is incorrect",
        });
      }

      // ✅ HASH NEW PASSWORD
      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      // ✅ UPDATE PASSWORD
      await prisma.users.update({
        where: {
          id: userId,
        },

        data: {
          password: hashedPassword,
        },
      });

      return res.status(200).json({
        message:
          "Password changed successfully",
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };

  // DELETE /auth/delete-account
export const deleteAccountController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { password } =
        req.body;

      const user =
        await prisma.users.findUnique({
          where: {
            id: (req as any).user.id,
          },
        });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isValid =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isValid) {
        return res.status(400).json({
          message:
            "Wrong password",
        });
      }

      await prisma.users.delete({
        where: {
          id: user.id,
        },
      });

      return res.json({
        message:
          "Account deleted successfully",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          "Internal server error",
      });
    }
  };