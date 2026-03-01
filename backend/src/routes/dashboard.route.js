import { Router } from "express";
import {
  getAdminDashboardStats,
  getFreelancerDashboardStats,
  getBuyerDashboardStats,
} from "../controllers/dashboard.controller.js";
import {
  auth,
  authAdmin,
  authFreelancer,
  authBuyer,
} from "../middlewares/auth.middleware.js";

const dashboardRouter = Router();

// All routes require authentication
dashboardRouter.use(auth);

// Admin dashboard (admin only)
dashboardRouter.get("/admin", authAdmin, getAdminDashboardStats);

// Freelancer dashboard (freelancer only)
dashboardRouter.get("/freelancer", authFreelancer, getFreelancerDashboardStats);

// Buyer dashboard (buyer only)
dashboardRouter.get("/buyer", authBuyer, getBuyerDashboardStats);

export default dashboardRouter;
