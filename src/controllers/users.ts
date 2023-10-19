import type { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const { email, username, password } = req.body;

  // 检查用户是否已经存在
  const existingUser = await User.findOne({ email });
  if (existingUser !== null) {
    return res.status(400).json({ error: "Email already exists!" });
  }

  const newUser = new User({ email, username, password });
  await newUser.save();

  return res.status(201).json(newUser);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
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
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | undefined> => {
  try {
    // 从中间件中获取已验证的用户
    const user = await User.findById(req.user?.userId).select("-password");
    if (user === undefined) {
      return res.status(400).json({ error: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
