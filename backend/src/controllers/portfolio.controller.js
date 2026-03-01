import Portfolio from "../models/portfolio.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { deleteFileByUrl, uploadImage } from "../utils/cloudinary.js";

// ==================== CREATE PORTFOLIO ====================
const createPortfolio = asyncHandler(async (req, res) => {
  const { title, description, link, tags, completionDate, featured } = req.body;
  const freelancerId = req.user._id;
  let imageUrl = "";

  // Validation
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  console.log(req.file)

  // Handle image upload if file exists
  if (req.file) {
    try {
      const result = await uploadImage(req.file.buffer, req.file.originalname);
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Portfolio image upload failed:", error);
      throw new ApiError(500, "Failed to upload portfolio image");
    }
  } else {
    throw new ApiError(400, "Portfolio image is required");
  }

  // Process tags (comma-separated string or array)
  let processedTags = [];
  if (tags) {
    if (typeof tags === "string") {
      if (tags.startsWith("[")) {
        try {
          processedTags = JSON.parse(tags);
        } catch {
          processedTags = tags.split(",").map((t) => t.trim());
        }
      } else if (tags.includes(",")) {
        processedTags = tags.split(",").map((t) => t.trim());
      } else {
        processedTags = [tags];
      }
    } else if (Array.isArray(tags)) {
      processedTags = tags;
    }
  }

  const portfolio = await Portfolio.create({
    freelancerId,
    title,
    description,
    image: imageUrl,
    link: link || "",
    tags: processedTags,
    completionDate: completionDate || null,
    featured: featured || false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, portfolio, "Portfolio created successfully"));
});

// ==================== GET ALL PORTFOLIOS (for a freelancer) ====================
const getFreelancerPortfolios = asyncHandler(async (req, res) => {
  const freelancerId = req?.user?._id;
  //   const { freelancerId } = req.params;
  const { featured, page = 1, limit = 10 } = req.query;

  const query = { freelancerId };
  if (featured !== undefined) {
    query.featured = featured === "true";
  }

  const skip = (Number(page) - 1) * Number(limit);

  const portfolios = await Portfolio.find(query)
    .sort({ featured: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Portfolio.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        portfolios,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Portfolios fetched successfully",
    ),
  );
});

// ==================== GET SINGLE PORTFOLIO ====================
const getPortfolioById = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new ApiError(400, "Invalid portfolio ID");
  }

  const portfolio = await Portfolio.findById(portfolioId);

  if (!portfolio) {
    throw new ApiError(404, "Portfolio not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, portfolio, "Portfolio fetched successfully"));
});

// ==================== UPDATE PORTFOLIO ====================
const updatePortfolio = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;
  const updates = req.body;
  const freelancerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new ApiError(400, "Invalid portfolio ID");
  }

  const portfolio = await Portfolio.findOne({
    _id: portfolioId,
    freelancerId,
  });

  if (!portfolio) {
    throw new ApiError(
      404,
      "Portfolio not found or you don't have permission to edit it",
    );
  }

  // Handle new image upload if file exists
  if (req.file) {
    try {
      // Delete old image if exists
      if (portfolio.image) {
        try {
          await deleteFileByUrl(portfolio.image);
        } catch (error) {
          console.log("Error deleting old portfolio image:", error);
        }
      }

      // Upload new image
      const result = await uploadImage(req.file.buffer, req.file.originalname);
      updates.image = result.secure_url;
    } catch (error) {
      console.error("Portfolio image upload failed:", error);
      throw new ApiError(500, "Failed to upload portfolio image");
    }
  }

  // Process tags if they're being updated
  if (updates.tags) {
    if (typeof updates.tags === "string") {
      if (updates.tags.startsWith("[")) {
        try {
          updates.tags = JSON.parse(updates.tags);
        } catch {
          updates.tags = updates.tags.split(",").map((t) => t.trim());
        }
      } else if (updates.tags.includes(",")) {
        updates.tags = updates.tags.split(",").map((t) => t.trim());
      } else {
        updates.tags = [updates.tags];
      }
    }
  }

  // Update only provided fields
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      portfolio[key] = updates[key];
    }
  });

  await portfolio.save();

  return res
    .status(200)
    .json(new ApiResponse(200, portfolio, "Portfolio updated successfully"));
});

// ==================== DELETE PORTFOLIO ====================
const deletePortfolio = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;
  const freelancerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new ApiError(400, "Invalid portfolio ID");
  }

  const portfolio = await Portfolio.findOneAndDelete({
    _id: portfolioId,
    freelancerId,
  });

  if (!portfolio) {
    throw new ApiError(
      404,
      "Portfolio not found or you don't have permission to delete it",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Portfolio deleted successfully"));
});

// ==================== TOGGLE FEATURED STATUS ====================
const toggleFeatured = asyncHandler(async (req, res) => {
  const { portfolioId } = req.params;
  const freelancerId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(portfolioId)) {
    throw new ApiError(400, "Invalid portfolio ID");
  }

  const portfolio = await Portfolio.findOne({
    _id: portfolioId,
    freelancerId,
  });

  if (!portfolio) {
    throw new ApiError(404, "Portfolio not found");
  }

  portfolio.featured = !portfolio.featured;
  await portfolio.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        portfolio,
        `Portfolio ${portfolio.featured ? "featured" : "unfeatured"} successfully`,
      ),
    );
});

// ==================== GET PUBLIC PORTFOLIOS (for public view) ====================
const getPublicPortfolios = asyncHandler(async (req, res) => {
  const { freelancerId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(freelancerId)) {
    throw new ApiError(400, "Invalid freelancer ID");
  }

  const skip = (Number(page) - 1) * Number(limit);

  const portfolios = await Portfolio.find({
    freelancerId,
    // You might want to only show featured or approved portfolios for public view
    // featured: true
  })
    .sort({ featured: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Portfolio.countDocuments({ freelancerId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        portfolios,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Public portfolios fetched successfully",
    ),
  );
});

export {
  createPortfolio,
  getFreelancerPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  toggleFeatured,
  getPublicPortfolios,
};
