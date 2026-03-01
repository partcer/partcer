import { model, Schema } from "mongoose";

const portfolioSchema = new Schema(
  {
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    completionDate: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for better query performance
portfolioSchema.index({ freelancerId: 1, featured: -1 });
portfolioSchema.index({ tags: 1 });

const Portfolio = model("Portfolio", portfolioSchema);

export default Portfolio;
