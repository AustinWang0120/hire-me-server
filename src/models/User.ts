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
    email: { type: String, required: true, unique: true }, // 邮箱字段，必填，唯一
    username: { type: String, required: true }, // 用户名字段，必填
    password: { type: String, required: true }, // 密码字段，必填
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString(); // 将_id字段转换为id字段string类型
        delete ret._id; // 删除_id字段
        delete ret.password; // 删除密码字段
        delete ret.__v; // 删除版本字段
        // 返回转换后的对象
        return ret;
      },
    },
  },
);

// 密码加密前保存
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    // 如果密码没有被修改，直接执行下一步
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10); // 生成盐
  const hashedPassword = await bcrypt.hash(this.password, salt); // 用盐加密密码
  this.password = hashedPassword; // 将加密后的密码保存到password字段
  next(); // 执行下一步
});

// 为模型添加方法，用于验证密码
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password); // 比较输入的密码和数据库中的密码是否一致
};

// 创建并导出User模型
export const User = mongoose.model<IUser>("User", UserSchema); // 创建User模型并导出
