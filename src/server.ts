import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import userRoutes from "./routes/users";
import jobApplicationRoutes from "./routes/jobapplications";

dotenv.config(); // 读取环境变量

void connectDatabase(); // 连接数据库

const app = express(); // 创建 express 应用

app.use(bodyParser.json()); // 解析请求体中的 JSON 数据
app.use(bodyParser.urlencoded({ extended: true })); // 解析请求体中的 urlencoded 数据

app.use("/api/v1/users", userRoutes); // 用户路由
app.use("/api/v1/job-applications", jobApplicationRoutes); // 工作申请记录路由

const PORT_NUMBER = parseInt(process.env.PORT as string, 10); // 从环境变量中读取端口号
const PORT: number = isNaN(PORT_NUMBER) ? 3001 : PORT_NUMBER; // 如果环境变量中没有端口号，则使用默认端口号 3001

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`); // 启动服务器并输出端口号
});
