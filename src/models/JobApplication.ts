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
const JobApplicationSchema: Schema = new Schema(
  {
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
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // 将_id字段转换为id字段string类型
        delete ret._id; // 删除_id字段
        delete ret.__v; // 删除版本字段
        return ret;
      },
    },
  },
);

// 创建并导出JobApplication模型
export const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema,
);
