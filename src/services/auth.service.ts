import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Auth } from "../types/auth";

import { generateReferralCode } from "../utils/generateReferral";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ✅ REGISTER
export async function registerUser(
  data: Auth
) {
  // cek email
  const existingUser =
    await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

  if (existingUser) {
    throw new Error(
      "Email already registered"
    );
  }

    // ✅ CHECK REFERRAL
  let referrer = null;

  if (data.referred_by_code) {
  referrer =
    await prisma.users.findUnique({
      where: {
        referral_code:
          data.referred_by_code,
      },
    });

  if (!referrer) {
    throw new Error(
      "Invalid referral code"
    );
  }
}

  // ✅ GENERATE REFERRAL CODE
  const myReferralCode =
    generateReferralCode(data.name);

  // hash password
  const hashedPassword =
    await bcrypt.hash(data.password, 10);

  // create user
  const user =
    await prisma.users.create({
      data: {
        name: data.name,

        email: data.email,

        password: hashedPassword,

        role:
          data.role || "CUSTOMER",

        referral_code:
          myReferralCode,

        referred_by_id:
          referrer?.id,
      },
    });

    // ✅ GIVE REFERRAL REWARD
if (referrer) {

  // kasih 10.000 points ke referrer
  await prisma.points.create({
    data: {
      user_id: referrer.id,

      amount: 10000,

      expired_at: new Date(
        Date.now() +
          1000 *
            60 *
            60 *
            24 *
            90
      ),
    },
  });

  // update balance
  await prisma.users.update({
    where: {
      id: referrer.id,
    },

    data: {
      points_balance: {
        increment: 10000,
      },
    },
  });

  // kasih coupon ke user baru
  await prisma.coupons.create({
    data: {
      user_id: user.id,

      discount_amount: 10000,

      expired_at: new Date(
        Date.now() +
          1000 *
            60 *
            60 *
            24 *
            90
      ),
    },
  });
}

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,

    referral_code:
      user.referral_code,
  };
}

// ✅ LOGIN
export async function loginUser(
  data: Auth
) {
  const user =
    await prisma.users.findUnique({
      where: {
        email: data.email,
      },
    });

  if (!user) {
    throw new Error(
      "User not registered"
    );
  }

  // compare password
  const isValid =
    await bcrypt.compare(
      data.password,
      user.password
    );

  if (!isValid) {
    throw new Error(
      "Invalid password"
    );
  }

  // generate token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,

    user: {
      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,

      referral_code:
        user.referral_code,

      profile_picture:
        user.profile_picture,
    },
  };
}
