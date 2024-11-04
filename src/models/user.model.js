import { Schema, model } from "mongoose";


const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    phoneNumber:{
      type:Number,
      required:true
    }
  
  },
);

const UserModel = model("User", userSchema);

export default UserModel;
