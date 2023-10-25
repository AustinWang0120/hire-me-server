import { composeWithMongoose } from "graphql-compose-mongoose";
import { JobApplication } from "../../models/JobApplication";

const customizationOptions = {};
export const JobApplicationTC = composeWithMongoose(
  JobApplication,
  customizationOptions,
);
