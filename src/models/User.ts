import mongoose, { Schema } from "mongoose";
import type { Document } from "mongoose";
import bcrypt from "bcryptjs";

// 定义User文档的接口
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

// 定义User模式
const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // 将_id字段转换为id字段string类型
        delete ret._id; // 删除_id字段
        delete ret.password; // 删除密码字段
        delete ret.__v; // 删除版本字段
        return ret;
      },
    },
  },
);

// 密码加密前保存
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// 为模型添加方法，用于验证密码
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 创建并导出User模型
export const User = mongoose.model<IUser>("User", UserSchema);
