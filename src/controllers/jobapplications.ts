import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { JobApplication } from "../models/JobApplication";
import { User } from "../models/User";
import { CustomError } from "../errors/CustomError";

// 1. 查询当前登录用户的所有求职申请记录
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;

    const user = await User.findById(userId).populate("jobApplications");

    if (!user) {
      return next(new CustomError("User not found.", 400));
    }

    return res.status(200).json(user.jobApplications);
  } catch (error) {
    next(error);
  }
};

// 2. 添加一个新的求职申请记录
export const addApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { applicationDate, companyName, positionName, positionLink, status } =
      req.body;
    const newApplication = new JobApplication({
      applicationDate,
      companyName,
      positionName,
      positionLink,
      status,
      user: userId,
    });
    await newApplication.save();

    // 找到当前用户并且更新其jobApplications字段
    const user = await User.findById(userId);
    if (user) {
      user.jobApplications.push(newApplication._id);
      await user.save();
    }

    return res.status(201).json(newApplication);
  } catch (error) {
    next(error);
  }
};

// 3. 修改一个求职申请记录的状态
export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const applicationId = req.params.applicationId; // 从params获取
    const { status } = req.body;

    const application = await JobApplication.findOne({
      _id: applicationId,
      user: userId,
    });

    if (!application) {
      return next(new CustomError("Application not found.", 404));
    }

    if (
      status !== "pending" &&
      status !== "interview" &&
      status !== "accepted" &&
      status !== "rejected"
    ) {
      return next(new CustomError("Status invalid.", 400));
    }

    application.status = status;
    await application.save();

    return res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

// 4. 删除一个求职申请记录
export const deleteApplication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const { applicationId } = req.params;

    const application = await JobApplication.findOne({
      _id: applicationId,
      user: userId,
    });

    if (!application) {
      return next(new CustomError("Application not found.", 404));
    }

    // 找到对应的用户并从其jobApplications字段中删除该申请的引用
    const user = await User.findById(userId);
    if (user) {
      // 使用toString方法将ObjectId转换为字符串，然后进行比较
      const index = user.jobApplications
        .map((id) => id.toString())
        .indexOf(applicationId);

      if (index > -1) {
        user.jobApplications.splice(index, 1);
        await user.save();
      }
    }

    await application.deleteOne();

    return res
      .status(200)
      .json({ message: "Application deleted successfully." });
  } catch (error) {
    next(error);
  }
};
