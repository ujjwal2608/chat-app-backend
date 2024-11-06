// Import required modules
import dotenv from 'dotenv';
dotenv.config();


import bodyParser from "body-parser";
import cors from "cors";
import { Expo } from "expo-server-sdk";
import { app,server } from './Socket/socket.js';

import db from "./config/database.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from './routes/message.route.js';
import userRouter from './routes/user.route.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


// dotenv.config({path:path.resolve(__dirname,'../.env')});
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to my Express server!");
});
// Custom route
app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});
app.use(authRouter);
app.use(messageRouter);
app.use(userRouter);
db();
// Start the server
server.listen(process.env.PORT||4000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Endpoint to send notification
app.post("/send-notification", async (req, res) => {
  const { pushToken, message } = req.body;
  if (pushToken) {
    console.log(pushToken);
  } else {
    console.log("token is undefined");
  }
  // Check if the push token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    return res.status(400).send("Invalid push token");
  }

  // Create the notification message
  const notification = {
    to: pushToken,
    sound: "default",
    title: "Notification Title",
    body: "this is notification from ther expo app",
  };

  try {
    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync([notification]);
    console.log("Notification sent successfully:", ticket);
    res.status(200).send("Notification sent");
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).send("Error sending notification");
  }
});
