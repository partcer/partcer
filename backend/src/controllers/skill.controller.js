// controllers/skill.controller.js
import Skill from "../models/skill.model.js";
import Category from "../models/category.model.js";

/**
 * @desc    Create a new skill
 * @route   POST /api/v1/admin/skills
 * @access  Private/Admin
 */
export const createSkill = async (req, res) => {
  try {
    const { name, categories, isActive, order } = req.body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Skill name is required",
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Check if skill with same name exists
    const existingSkill = await Skill.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name.trim()}$`, "i") } },
        { slug: slug },
      ],
    });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill with this name already exists",
      });
    }

    // Validate categories if provided
    let categoryIds = [];
    if (categories) {
      if (Array.isArray(categories)) {
        categoryIds = categories;
      } else {
        try {
          categoryIds = JSON.parse(categories);
        } catch (e) {
          categoryIds = [categories];
        }
      }

      // Verify categories exist
      if (categoryIds.length > 0) {
        const existingCategories = await Category.find({
          _id: { $in: categoryIds },
        });
        if (existingCategories.length !== categoryIds.length) {
          return res.status(400).json({
            success: false,
            message: "One or more categories do not exist",
          });
        }
      }
    }

    // Create skill
    const skill = await Skill.create({
      name: name.trim(),
      slug: slug,
      categories: categoryIds,
      isActive: isActive === "true" || isActive === true,
      order: parseInt(order) || 0,
      createdBy: req.user?._id,
    });

    // Populate categories for response
    await skill.populate("categories", "name slug");

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create skill",
    });
  }
};

/**
 * @desc    Get all skills with filters
 * @route   GET /api/v1/admin/skills
 * @access  Private/Admin
 */
export const getAllSkills = async (req, res) => {
  try {
    const {
      search,
      status,
      category,
      sortBy = "order",
      sortOrder = "asc",
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }];
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    if (category) {
      filter.categories = category;
    }

    // Build sort
    const sort = {};
    if (sortBy === "order") {
      sort.order = sortOrder === "desc" ? -1 : 1;
      sort.name = 1; // Secondary sort by name
    } else {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    }

    // Get skills
    const skills = await Skill.find(filter)
      .populate("categories", "name slug")
      .sort(sort);

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Get all skills error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

/**
 * @desc    Get skill by ID
 * @route   GET /api/v1/admin/skills/:id
 * @access  Private/Admin
 */
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id).populate("categories", "name slug");

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Get skill by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};

/**
 * @desc    Update skill
 * @route   PUT /api/v1/admin/skills/:id
 * @access  Private/Admin
 */
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categories, isActive, order } = req.body;

    // Find skill
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name.trim() !== skill.name) {
      // Generate new slug
      const newSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();

      const existingSkill = await Skill.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${name.trim()}$`, "i") } },
          { slug: newSlug },
        ],
        _id: { $ne: id },
      });

      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: "Skill with this name already exists",
        });
      }

      skill.name = name.trim();
      skill.slug = newSlug;
    }

    // Handle categories update
    if (categories !== undefined) {
      let categoryIds = [];
      if (Array.isArray(categories)) {
        categoryIds = categories;
      } else if (categories) {
        try {
          categoryIds = JSON.parse(categories);
        } catch (e) {
          categoryIds = [categories];
        }
      }

      // Verify categories exist if any are provided
      if (categoryIds.length > 0) {
        const existingCategories = await Category.find({
          _id: { $in: categoryIds },
        });
        if (existingCategories.length !== categoryIds.length) {
          return res.status(400).json({
            success: false,
            message: "One or more categories do not exist",
          });
        }
      }

      skill.categories = categoryIds;
    }

    // Update other fields
    if (isActive !== undefined) {
      skill.isActive = isActive === "true" || isActive === true;
    }
    if (order !== undefined) {
      skill.order = parseInt(order) || 0;
    }

    await skill.save();
    await skill.populate("categories", "name slug");

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update skill",
    });
  }
};

/**
 * @desc    Delete skill
 * @route   DELETE /api/v1/admin/skills/:id
 * @access  Private/Admin
 */
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    // Check if skill has services
    if (skill.serviceCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete skill. There are ${skill.serviceCount} services using this skill.`,
      });
    }

    // Delete skill
    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};

/**
 * @desc    Toggle skill status
 * @route   PATCH /api/v1/admin/skills/:id/toggle-status
 * @access  Private/Admin
 */
export const toggleSkillStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    skill.isActive = !skill.isActive;
    await skill.save();

    res.status(200).json({
      success: true,
      message: `Skill ${skill.isActive ? "activated" : "deactivated"} successfully`,
      data: skill,
    });
  } catch (error) {
    console.error("Toggle skill status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle skill status",
    });
  }
};

/**
 * @desc    Get skills by category
 * @route   GET /api/v1/admin/skills/by-category/:categoryId
 * @access  Private/Admin
 */
export const getSkillsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const skills = await Skill.find({
      categories: categoryId,
      isActive: true,
    })
      .select("name order")
      .sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: {
        category: {
          _id: category._id,
          name: category.name,
        },
        skills,
      },
    });
  } catch (error) {
    console.error("Get skills by category error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

/**
 * @desc    Bulk create skills
 * @route   POST /api/v1/admin/skills/bulk
 * @access  Private/Admin
 */
export const bulkCreateSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of skills",
      });
    }

    const results = {
      created: [],
      skipped: [],
      errors: [],
    };

    for (const skillData of skills) {
      try {
        const { name, categories = [], isActive = true, order = 0 } = skillData;

        if (!name || name.trim() === "") {
          results.errors.push({ name, reason: "Name is required" });
          continue;
        }

        // Generate slug
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();

        // Check if exists
        const existing = await Skill.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${name.trim()}$`, "i") } },
            { slug },
          ],
        });

        if (existing) {
          results.skipped.push({ name, reason: "Already exists" });
          continue;
        }

        // Validate categories
        let categoryIds = [];
        if (categories.length > 0) {
          const existingCategories = await Category.find({
            _id: { $in: categories },
          });
          if (existingCategories.length === categories.length) {
            categoryIds = categories;
          }
        }

        // Create skill
        const skill = await Skill.create({
          name: name.trim(),
          slug,
          categories: categoryIds,
          isActive,
          order: parseInt(order) || 0,
          createdBy: req.user?._id,
        });

        results.created.push(skill);
      } catch (error) {
        results.errors.push({ name: skillData.name, reason: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${results.created.length} skills, skipped ${results.skipped.length}, errors ${results.errors.length}`,
      data: results,
    });
  } catch (error) {
    console.error("Bulk create skills error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk create skills",
    });
  }
};

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================

/**
 * @desc    Get all active skills for public
 * @route   GET /api/v1/skills/public
 * @access  Public
 */
export const getPublicSkills = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { isActive: true };
    if (category) {
      filter.categories = category;
    }

    const skills = await Skill.find(filter)
      .select("name slug categories order")
      .populate("categories", "name slug")
      .sort({ order: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Get public skills error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

/**
 * @desc    Get skill by slug for public
 * @route   GET /api/v1/skills/public/by-slug/:slug
 * @access  Public
 */
export const getPublicSkillBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const skill = await Skill.findOne({
      slug,
      isActive: true,
    }).populate("categories", "name slug");

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error("Get public skill by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};
