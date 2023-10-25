import { composeWithMongoose } from "graphql-compose-mongoose";
import { User } from "../../models/User";

const customizationOptions = {};

export const UserTC = composeWithMongoose(User, customizationOptions);
