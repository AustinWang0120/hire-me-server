import mongoose from "mongoose";

// 连接数据库
export const connectDatabase = async (): Promise<void> => {
  // 获取数据库连接地址
  const DB_URI: string | undefined = process.env.MONGO_DB_URI;
  // 如果连接地址不存在或为空，则抛出错误
  if (DB_URI === undefined || DB_URI === "") {
    throw new Error("MONGO_DB_URI must be set in the environment");
  }

  try {
    // 使用 mongoose 连接数据库
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("MongoDB connected successfully.");
  } catch (error: any) {
    // 如果连接出错，则输出错误信息并退出进程
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
