import { Router } from "express";
import authRoutes from "./authRoutes";
import quoteRoutes from "./quoteRoutes";
import topicRoutes from "./topicRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/quotes", quoteRoutes);
router.use("/topics", topicRoutes);

export default router;
