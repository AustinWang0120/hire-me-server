import { JobApplication } from "../../models/JobApplication";

export const UserResolvers = {
  User: {
    jobApplications: async (parent: any) => {
      return await JobApplication.find({
        _id: { $in: parent.jobApplications },
      }).exec();
    },
  },
};
