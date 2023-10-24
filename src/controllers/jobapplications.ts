import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";
import { JobApplication } from "../models/JobApplication";

// 1. 查询当前登录用户的所有求职申请记录
export const getAllApplications = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const applications = await JobApplication.find({ user: userId });
    return res.status(200).json(applications);
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
      return res.status(404).json({ error: "Application not found." });
    }

    if (
      status !== "pending" &&
      status !== "interview" &&
      status !== "accepted" &&
      status !== "rejected"
    ) {
      return res.status(400).json({ error: "Status invalid." });
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
      return res.status(404).json({ error: "Application not found." });
    }

    await application.deleteOne();

    return res
      .status(200)
      .json({ message: "Application deleted successfully." });
  } catch (error) {
    next(error);
  }
};
