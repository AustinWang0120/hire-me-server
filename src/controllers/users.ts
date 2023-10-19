import type { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { email, username, password } = req.body;

    // 检查用户是否已经存在
    const existingUser = await User.findOne({ email });
    if (existingUser !== null) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const newUser = new User({ email, username, password });
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret === undefined) {
      throw new Error("JWT_SECRET is not defined in .env file");
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    // 从中间件中获取已验证的用户
    const user = await User.findById(
      (req as AuthenticatedRequest).user?.userId,
    ).select("-password");
    if (user === undefined) {
      return res.status(400).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId; // 假设从JWT中解析出来的用户ID

    await User.findByIdAndRemove(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const user = await User.findByIdAndUpdate(userId, { email }, { new: true });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { username } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true },
    );
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
