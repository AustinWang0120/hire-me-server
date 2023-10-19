import { Router } from "express";
import { register, login } from "../controllers/users";
const router = Router();

router.post("/register", (req, res, next) => {
  (async () => {
    await register(req, res, next);
  })().catch(next);
});

router.post("/login", (req, res, next) => {
  (async () => {
    await login(req, res, next);
  })().catch(next);
});

export default router;
