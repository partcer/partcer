// routes/category.routes.js
import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getParentCategories,
  getSubcategoriesByParent,
  getCategoryTree,
  // Public controllers
  getPublicParentCategories,
  getPublicSubcategories,
  getPublicCategoryBySlug,
  getPublicCategoryById,
  getPublicSubcategoriesByParentId,
} from "../controllers/category.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const categoryRouter = express.Router();

// =============================================
// PUBLIC ROUTES (No authentication)
// =============================================
categoryRouter.get("/public/parents", getPublicParentCategories); 
categoryRouter.get("/public/:parentSlug/children", getPublicSubcategories);
categoryRouter.get("/public/by-slug/:slug", getPublicCategoryBySlug);
categoryRouter.get("/public/by-id/:id", getPublicCategoryById);
categoryRouter.get("/public/:parentId/subcategories", getPublicSubcategoriesByParentId);

// =============================================
// ADMIN ROUTES (Authentication required)
// =============================================
categoryRouter.use(auth, authAdmin);

// Category CRUD
categoryRouter.post("/", upload.single("categoryImage"), createCategory);
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/tree", getCategoryTree);
categoryRouter.get("/parents", getParentCategories);
categoryRouter.get("/:parentId/subcategories", getSubcategoriesByParent);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.put("/:id", upload.single("categoryImage"), updateCategory);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.patch("/:id/toggle-status", toggleCategoryStatus);

export default categoryRouter;