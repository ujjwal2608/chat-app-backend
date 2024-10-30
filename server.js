// Import required modules
import express from 'express';
import bodyParser from 'body-parser';
import { Expo } from 'expo-server-sdk';

const app = express();
const expo = new Expo();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to my Express server!');
});

// Custom route
app.get('/hello', (req, res) => {
  res.send('Hello, world!');
});

// Endpoint to send notification
app.post('/send-notification', async (req, res) => {
  const { pushToken, message } = req.body;

  // Check if the push token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    return res.status(400).send('Invalid push token');
  }

  // Create the notification message
  const notification = {
    to: pushToken,
    sound: 'default',
    title: 'Notification Title',
    body: message,
  };

  try {
    // Send the notification
    const ticket = await expo.sendPushNotificationsAsync([notification]);
    console.log('Notification sent successfully:', ticket);
    res.status(200).send('Notification sent');
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send('Error sending notification');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
