import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  getAllApplications,
  addApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/jobapplications";
const router = Router();

router.use(authenticate);

router.get("/", getAllApplications);
router.post("/", addApplication);
router.put("/:applicationId/status", updateApplicationStatus);
router.delete("/:applicationId", deleteApplication);

export default router;
