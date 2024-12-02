const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../data/completed-events.log');

function logEvent(event) {
  const logEntry = `${new Date().toISOString()} - Event Completed: ${event.title}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
}

module.exports = { logEvent };
