import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
  freelancerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

const Review = model("Review", reviewSchema);

export default Review;