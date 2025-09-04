import User from "../Models/UserModel.js";
import Message from "../Models/Message.js";
import cloudinary from "../Lib/Cloud.js";
import { getIo, userSocketMap } from "../Lib/socket.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};
    await Promise.all(
      users.map(async (user) => {
        const count = await Message.countDocuments({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });
        if (count > 0) unseenMessages[user._id] = count;
      })
    );

    res.json({ success: true, users, unseenMessages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const selectedUserId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    await Message.updateMany(
      { senderId: req.params.id, receiverId: req.user._id, seen: false },
      { seen: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId: req.user._id,
      receiverId: req.params.id,
      text,
      image: imageUrl,
    });

    const receiverSocketId = userSocketMap[req.params.id];
    if (receiverSocketId) getIo().to(receiverSocketId).emit("newMessage", newMessage);

    res.json({ success: true, newMessage });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
