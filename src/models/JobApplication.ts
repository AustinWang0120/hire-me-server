import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";
import type { IUser } from "./User";

// 定义JobApplication文档的接口
export interface IJobApplication extends Document {
  applicationDate: Date;
  companyName: string;
  positionName: string;
  positionLink: string;
  status: "pending" | "interview" | "accepted" | "rejected";
  user: IUser["_id"];
}

// 定义JobApplication模式
const JobApplicationSchema: Schema = new Schema({
  applicationDate: { type: Date, required: true },
  companyName: { type: String, required: true },
  positionName: { type: String, required: true },
  positionLink: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "interview", "accepted", "rejected"],
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// 创建并导出JobApplication模型
export const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema,
);
