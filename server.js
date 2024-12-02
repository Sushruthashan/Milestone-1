const express = require('express');
const { setupWebSocket, scheduleEventNotifications } = require('./utils/scheduler');
const eventsRouter = require('./controllers/eventsController');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// API routes
app.use('/events', eventsRouter);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Set up WebSocket server and schedule event notifications
setupWebSocket(server);
scheduleEventNotifications();
