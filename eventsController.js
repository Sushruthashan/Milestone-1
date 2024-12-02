const express = require('express');
const router = express.Router();
const { addEvent, getEvents } = require('../utils/scheduler');

let events = []; // In-memory storage for events

// POST /events - Add a new event
router.post('/', (req, res) => {
  const { title, description, time } = req.body;

  if (!title || !description || !time) {
    return res.status(400).json({ status: 'error', data: null, error: 'Missing required fields' });
  }

  const newEvent = addEvent(events, { title, description, time });
  res.status(201).json({ status: 'success', data: newEvent, error: null });
});

// GET /events - Get all upcoming events
router.get('/', (req, res) => {
  const upcomingEvents = getEvents(events);
  res.status(200).json({ status: 'success', data: upcomingEvents, error: null });
});

module.exports = router;
