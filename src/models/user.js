import { Schema, model } from "mongoose";


const userSchema = new Schema(
  {
    name: String,
    phoneNumber: Number,
    password: String,
  },
);

const UserModel = model("user", userSchema);

export default UserModel;
