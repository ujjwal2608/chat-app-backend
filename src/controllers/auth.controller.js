import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../constants.js';

function generateAuthToken(data) {
  const token = jwt.sign(data, process.env.TOKEN_KEY, { expiresIn: "10h" });
  return token;
}

export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user does not exist with this phoneNumber and password",
      });
    }

    // bcrypting the password and comparing with the one in db
    if (await bcrypt.compare(password, user.password)) {
      const token = generateAuthToken({
        _id: user?._id,
        phoneNumber: phoneNumber,
      });
     

      return res.status(200).json({
        success: true,
        message: "user Logged in",
        data: user,
        token:token
      });
    }
    return res.status(400).json({
      success: false,
      message: "user credentials are not correct",
    });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
};

export const register = async (req, res) => {
    try {
      const { phoneNumber, password, name } = req.body;
  
      // Check if any required fields are missing
      if (!phoneNumber || !password || !name) {
        return res.json({
          success: false,
          message: "phoneNumber, password, or name is empty",
        });
      }
  
      // Check if a user with the same phone number already exists
      const existingUser = await UserModel.findOne({ phoneNumber });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "A user with this phone number already exists",
        });
      }
  
      // Hash the password
      req.body.password = await bcrypt.hash(password, 10);
  
      // Create and save the new user
      const user = new UserModel(req.body);
      await user.save();
  
      return res.json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      return res.status(500).send({ err: error.message });
    }
  };
  
  
  export const resetPassword = async (req, res) => {
    try {
      const { password, newPassword } = req.body;
      const { id } = req.query;
  
      if (!password || !newPassword || !id)
        return res.status(400).json({ err: "Fields are empty" });
  
      const user = await UserModel.findOne({ _id: id });
  
      if (!user) return res.status(400).json({ err: "user does not exist" });
  
      // comparing the password from the password in DB to allow changes
      if (bcrypt.compare(password, user?.password)) {
        // encrypting new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.save();
        return res.json({
          success: true,
          message: "password updated successfully",
        });
      }
  
      return res.json({
        success: false,
        message: "wrong password",
      });
    } catch (error) {
      return res.status(500).send({ err: error.message });
    }
  };
  