import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";
import userRoutes from "./routes/users";
import jobApplicationRoutes from "./routes/jobapplications";

dotenv.config();

void connectDatabase();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/job-applications", jobApplicationRoutes);

const PORT_NUMBER = parseInt(process.env.PORT as string, 10);
const PORT: number = isNaN(PORT_NUMBER) ? 3001 : PORT_NUMBER;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
