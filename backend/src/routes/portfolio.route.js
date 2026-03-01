import { Router } from "express";
import {
  createPortfolio,
  getFreelancerPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  toggleFeatured,
  getPublicPortfolios
} from "../controllers/portfolio.controller.js";
import { auth, authFreelancer, optionalAuth } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const portfolioRouter = Router();

// ==================== PUBLIC ROUTES ====================
portfolioRouter.get("/public/:freelancerId", getPublicPortfolios);
portfolioRouter.get("/:portfolioId", getPortfolioById);

// ==================== PROTECTED ROUTES (Freelancer only) ====================
portfolioRouter.use(auth, authFreelancer); // All routes below require freelancer auth

portfolioRouter.post("/", upload.single('portfolioImage'), createPortfolio);
portfolioRouter.get("/", getFreelancerPortfolios);
portfolioRouter.patch("/:portfolioId", upload.single('portfolioImage'), updatePortfolio);
portfolioRouter.delete("/:portfolioId", deletePortfolio);
portfolioRouter.patch("/:portfolioId/toggle-featured", toggleFeatured);

export default portfolioRouter;