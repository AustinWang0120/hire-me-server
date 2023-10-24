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
    applicationDate: { type: Date, required: true }, // 申请日期字段，必填
    companyName: { type: String, required: true }, // 公司名称字段，必填
    positionName: { type: String, required: true }, // 职位名称字段，必填
    positionLink: { type: String, required: true }, // 职位链接字段，必填
    status: {
      type: String,
      enum: ["pending", "interview", "accepted", "rejected"],
      required: true,
    }, // 状态字段，必填，只能是pending、interview、accepted、rejected中的一个
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 用户字段，必填
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // 将_id字段转换为id字段string类型
        delete ret._id; // 删除_id字段
        delete ret.__v; // 删除版本字段
        return ret; // 返回转换后的对象
      },
    },
  },
);

// 创建并导出JobApplication模型
export const JobApplication = mongoose.model<IJobApplication>(
  "JobApplication",
  JobApplicationSchema,
);
