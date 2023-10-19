import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  const DB_URI: string | undefined = process.env.MONGO_DB_URI;
  if (DB_URI === undefined || DB_URI === "") {
    throw new Error("MONGO_DB_URI must be set in the environment");
  }

  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("MongoDB connected successfully.");
  } catch (error: any) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
