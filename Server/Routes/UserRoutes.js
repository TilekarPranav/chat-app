import express from "express";
import { signup, login, checkAuth, updateProfile } from "../Controllers/userController.js";
import protectRoutes from "../MiddleWare/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth", protectRoutes, checkAuth);
router.put("/update-profile", protectRoutes, updateProfile);

export default router;
