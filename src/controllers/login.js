import UserModel from '../models/user.js';
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
      user.token = token;
      user.save();

      return res.status(200).json({
        success: true,
        message: "user Logged in",
        data: user,
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
