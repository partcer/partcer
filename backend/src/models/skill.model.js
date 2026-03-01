// models/skill.model.js
import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    serviceCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Generate slug from name before saving
skillSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

// Update service count
skillSchema.methods.updateServiceCount = async function () {
  const Service = mongoose.model("Service");
  const count = await Service.countDocuments({
    skills: this._id,
    status: "active",
  });
  this.serviceCount = count;
  return this.save();
};

// Indexes for better performance
skillSchema.index({ name: 1 });
// skillSchema.index({ slug: 1 });
skillSchema.index({ isActive: 1 });
skillSchema.index({ order: 1 });
skillSchema.index({ categories: 1 });

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
