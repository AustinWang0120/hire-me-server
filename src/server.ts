import express from "express";
import type { Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDatabase } from "./config/database";

dotenv.config();

void connectDatabase();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, HireMe!");
});

const PORT_NUMBER = parseInt(process.env.PORT as string, 10);
const PORT: number = isNaN(PORT_NUMBER) ? 3001 : PORT_NUMBER;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
