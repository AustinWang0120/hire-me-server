import { SchemaComposer } from "graphql-compose";
import { UserTC } from "./types/userType";
import { JobApplicationTC } from "./types/jobApplicationType";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
  userById: UserTC.getResolver("findById"),
  userOne: UserTC.getResolver("findOne"),
  userMany: UserTC.getResolver("findMany"),
});

schemaComposer.Mutation.addFields({
  createUser: UserTC.getResolver("createOne"),
  updateUser: UserTC.getResolver("updateById"),
  removeUser: UserTC.getResolver("removeById"),
});

schemaComposer.Query.addFields({
  jobApplicationById: JobApplicationTC.getResolver("findById"),
  jobApplicationOne: JobApplicationTC.getResolver("findOne"),
  jobApplicationMany: JobApplicationTC.getResolver("findMany"),
});

schemaComposer.Mutation.addFields({
  createJobApplication: JobApplicationTC.getResolver("createOne"),
  updateJobApplication: JobApplicationTC.getResolver("updateById"),
  removeJobApplication: JobApplicationTC.getResolver("removeById"),
});

export default schemaComposer.buildSchema();
