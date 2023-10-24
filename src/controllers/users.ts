import type { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { User } from "../models/User";
import { CustomError } from "../errors/CustomError";
import jwt from "jsonwebtoken";

// 注册新用户
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { email, username, password } = req.body;

    // 检查用户是否已经存在
    const existingUser = await User.findOne({ email });
    // 如果用户已经存在，则返回错误信息
    if (existingUser !== null) {
      return next(new CustomError("Email already exists!", 400));
    }

    // 创建新用户
    const newUser = new User({ email, username, password });
    await newUser.save();

    // 返回新用户
    return res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// 用户登录
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (user === null) {
      return next(new CustomError("Invalid email or password.", 400));
    }

    // 检查密码是否正确
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new CustomError("Invalid email or password.", 400));
    }

    // 生成JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret === undefined) {
      return next(
        new CustomError("JWT_SECRET is not defined in .env file", 500),
      );
    }
    const payload = { userId: user._id };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "1h",
    });

    // 返回JWT
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// 获取当前用户
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

    // 如果用户不存在，则返回错误信息
    if (user === undefined) {
      return next(new CustomError("User not found.", 400));
    }

    // 返回用户
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 删除用户
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    // 从中间件中获取已验证的用户
    const userId = (req as AuthenticatedRequest).user?.userId;

    // 删除用户
    await User.findByIdAndRemove(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// 更新用户信息
export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    // 从中间件中获取已验证的用户
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { email } = req.body;

    // 检查用户是否已经存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new CustomError("Email already exists!", 400));
    }

    // 更新用户信息
    const user = await User.findByIdAndUpdate(userId, { email }, { new: true });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// 更新用户名
export const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { username } = req.body;

    // 更新用户名
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

// 更新密码
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    // 从中间件中获取已验证的用户
    const userId = (req as AuthenticatedRequest).user?.userId;
    // 从请求体中获取旧密码和新密码
    const { oldPassword, newPassword } = req.body;

    // 检查用户是否存在
    const user = await User.findById(userId);
    if (!user) {
      return next(new CustomError("User not found.", 400));
    }

    // 检查旧密码是否正确
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(new CustomError("Invalid password.", 400));
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    // 返回成功信息
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};
