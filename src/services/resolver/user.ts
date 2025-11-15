// src/services/resolver/user.ts
import { cookies } from "next/headers";
import prismaclient from "../prisma/prisma";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

// ------------------------
// Create User Resolver
// ------------------------
export async function createUser(
  _: any,
  args: { name: string; email: string; username: string; password: string; avatar?: string }
) {
  try {
    // Check for existing username or email
    const existingUser = await prismaclient.user.findFirst({
      where: {
        OR: [
          { email: args.email },
          { username: args.username }
        ],
      },
    });
    console.log(existingUser);
    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(args.password, 10);

    // Create new user
    const newUser = await prismaclient.user.create({
      data: {
        name: args.name,
        email: args.email,
        username: args.username,
        password: hashedPassword,
        avatar: args.avatar,
      },
    });

    return newUser;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "Error creating user");
  }
}

// ------------------------
// Login User Resolver
// ------------------------
export async function loginUser(_: any, args: { email: string; password: string }) {
  try {
    // Find user by email
    const user = await prismaclient.user.findUnique({ where: { email: args.email } })as User | null;
    if (!user?.id) throw new Error("Invalid credentials");

    // Compare password with hashed password
    const passwordMatch = await bcrypt.compare(args.password, user.password);
    if (!passwordMatch) throw new Error("Invalid credentials");

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "Active_user",
      value: user.id,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    console.log("User logged in 1:", user);
    return user;
  } catch (error: any) {
    console.error("Login resolver error:", error);
    throw new Error(error.message);
  }
}

// ------------------------
// Logout User Resolver
// ------------------------
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("Active_user");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

// ------------------------
// Get User By Token Resolver
// ------------------------
export async function getuserByToken(_: any, args: { userId: string }) {
  try {
    return await prismaclient.user.findUnique({ where: { id: args.userId } });
  } catch (error) {
    console.error("getUserByToken error:", error);
    return null;
  }
}
