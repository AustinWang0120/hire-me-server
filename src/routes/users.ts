import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import {
  register,
  login,
  getMe,
  deleteUser,
  updateEmail,
  updateUsername,
  updatePassword,
} from "../controllers/users";
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);

router.get("/me", getMe);
router.delete("/delete", deleteUser);
router.put("/update-email", updateEmail);
router.put("/update-username", updateUsername);
router.put("/update-password", updatePassword);

export default router;
