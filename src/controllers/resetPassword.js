import UserModel from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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
