import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // if any one of the field from phoneNumber and password is not filled
    if (!phoneNumber || !password) {
      return res.json({
        success: false,
        message: "phoneNumber or password is empty",
      });
    }
    req.body.password = await bcrypt.hash(password, 10);

    const user = new UserModel(req.body);
    await user.save();

    return res.json({
      success: true,
      message: "user registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).send({ err: error.message });
  }
};
