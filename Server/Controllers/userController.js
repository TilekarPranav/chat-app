import bcrypt from "bcryptjs";
import User from "../Models/UserModel.js";
import { generateToken } from "../Lib/Utils.js";
import cloud from "../Lib/Cloud.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, bio } = req.body;
    if (!fullName || !email || !password || !bio)
      return res.json({ success: false, message: "Missing details" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "Account already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ fullName, email, password: hashPassword, bio });
    const token = generateToken(newUser._id);

    const userObj = newUser.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj, token, message: "Account created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj, token, message: "Login successful" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Check Auth
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    let updatedUser;

    if (profilePic) {
      const upload = await cloud.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(req.user._id, { bio, fullName }, { new: true });
    }

    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json({ success: true, user: userObj });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
