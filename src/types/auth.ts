import { Role } from "@prisma/client";

export interface Auth {
  name: string;

  email: string;

  password: string;

  confirmPassword?: string;

  role?: Role;

  referred_by_code?: string;
}