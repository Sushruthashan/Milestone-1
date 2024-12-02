const cron = require('node-cron');
const WebSocket = require('ws');
const { logEvent } = require('./logger');

let clients = []; // WebSocket clients
let events = [];  // In-memory storage for events

// Set up WebSocket
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.push(ws);

    ws.on('close', () => {
      clients = clients.filter((client) => client !== ws);
    });
  });
}

// Add an event
function addEvent(eventList, event) {
  eventList.push(event);
  eventList.sort((a, b) => new Date(a.time) - new Date(b.time)); // Sort by time
  checkOverlaps(eventList);
  return event;
}

// Get all upcoming events
function getEvents(eventList) {
  const now = new Date();
  return eventList.filter((event) => new Date(event.time) > now);
}

// Notify clients
function notifyClients(event, type) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, event }));
    }
  });
}

// Check for overlapping events
function checkOverlaps(eventList) {
  for (let i = 0; i < eventList.length - 1; i++) {
    const current = new Date(eventList[i].time);
    const next = new Date(eventList[i + 1].time);

    if (current >= next) {
      notifyClients(eventList[i], 'overlap');
      notifyClients(eventList[i + 1], 'overlap');
    }
  }
}

// Schedule notifications
function scheduleEventNotifications() {
  cron.schedule('* * * * *', () => {
    const now = new Date();

    events.forEach((event, index) => {
      const eventTime = new Date(event.time);
      const timeDiff = (eventTime - now) / 60000;

      // Notify 5 minutes before the event
      if (timeDiff <= 5 && timeDiff > 4) {
        notifyClients(event, 'upcoming');
      }

      // Log and remove completed events
      if (timeDiff <= 0) {
        logEvent(event);
        events.splice(index, 1);
      }
    });
  });
}

module.exports = { setupWebSocket, addEvent, getEvents, scheduleEventNotifications };
