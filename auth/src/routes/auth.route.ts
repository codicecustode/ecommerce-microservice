import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const createAuthRoutes = (authController: AuthController) => {
  const router = Router();

  router.post("/login", authController.login);
  router.post("/register", authController.register);
  router.get("/dashboard", authMiddleware, authController.getProfile);

  return router;
};

export default createAuthRoutes;
