import Mongoose from "mongoose";
import { DB_URL } from "../constants.js";

export default () => {
  new Promise((resolve, reject) => {
    Mongoose.set("strictQuery", false);
    const uri= process.env.DB_URL;
    Mongoose.connect(uri)
      .then(() => {
        console.log("connect to mongo");
        resolve(true);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
