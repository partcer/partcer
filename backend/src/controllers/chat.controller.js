import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFile } from "../utils/cloudinary.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const uploadChatFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  try {
    const uploadResult = await uploadFile(
      req.file.buffer,
      req.file.originalname,
    );

    // Determine file type
    let fileType = "other";
    if (req.file.mimetype.startsWith("image/")) fileType = "image";
    else if (req.file.mimetype.startsWith("video/")) fileType = "video";
    else if (
      req.file.mimetype.includes("pdf") ||
      req.file.mimetype.includes("document")
    )
      fileType = "document";

    const fileData = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, fileData, "File uploaded successfully"));
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new ApiError(500, "Failed to upload file");
  }
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  // Soft delete - mark as deleted for this user
  message.deletedFor.push(req.user._id);
  await message.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Message deleted successfully"));
});

export const createOrGetConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }

  const conversation = await Conversation.getOrCreate(req.user._id, userId);

  await conversation.populate(
    "participants",
    "firstName lastName profileImage userType",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, conversation, "Conversation ready"));
});
