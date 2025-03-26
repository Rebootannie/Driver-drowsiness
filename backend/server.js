// backend/server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store drowsiness data in memory (use a database for production)
const drowsinessData = [];
const alertEvents = [];

// For development: Create a mock generator to simulate ML model data
let simulationActive = false;
let simulationInterval = null;
let currentState = false; // not drowsy

// Log info to console
function logInfo(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// REST API endpoint to receive data from ML model
app.post('/api/drowsiness', (req, res) => {
  const { isDrowsy, timestamp } = req.body;
  
  logInfo(`Received drowsiness state: ${isDrowsy ? 'DROWSY' : 'ALERT'}`);
  
  // Store data point
  const dataPoint = {
    isDrowsy: !!isDrowsy, // Boolean state
    level: isDrowsy ? 100 : 0, // Convert to 0 or 100 for visualization
    timestamp: timestamp || new Date().toISOString()
  };
  
  drowsinessData.push(dataPoint);
  
  // If this was an alert (drowsy state), record it
  if (dataPoint.isDrowsy) {
    alertEvents.push(dataPoint);
  }
  
  // Broadcast to all connected WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'data', data: dataPoint }));
    }
  });
  
  res.status(200).json({ success: true });
});

// REST API to get historical data
app.get('/api/drowsiness/history', (req, res) => {
  const { hours } = req.query;
  const timeAgo = hours ? new Date(Date.now() - hours * 60 * 60 * 1000) : null;
  
  const filteredData = timeAgo ? 
    drowsinessData.filter(d => new Date(d.timestamp) > timeAgo) :
    drowsinessData;
  
  res.status(200).json(filteredData);
});

// Control endpoints for the simulation (to test without ML model)
app.post('/api/simulation/start', (req, res) => {
  if (simulationActive) {
    return res.status(400).json({ error: 'Simulation already running' });
  }
  
  simulationActive = true;
  
  // Generate random drowsiness data
  simulationInterval = setInterval(() => {
    // Occasionally change state (20% chance)
    if (Math.random() < 0.2) {
      currentState = !currentState;
      logInfo(`Simulation state changed to: ${currentState ? 'DROWSY' : 'ALERT'}`);
    }
    
    const dataPoint = {
      isDrowsy: currentState,
      level: currentState ? 100 : 0,
      timestamp: new Date().toISOString()
    };
    
    drowsinessData.push(dataPoint);
    
    if (dataPoint.isDrowsy) {
      alertEvents.push(dataPoint);
    }
    
    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'data', data: dataPoint }));
      }
    });
  }, 2000); // Generate data every 2 seconds
  
  logInfo('Simulation started');
  res.status(200).json({ success: true, message: 'Simulation started' });
});

app.post('/api/simulation/stop', (req, res) => {
  if (!simulationActive) {
    return res.status(400).json({ error: 'No simulation running' });
  }
  
  clearInterval(simulationInterval);
  simulationActive = false;
  
  logInfo('Simulation stopped');
  res.status(200).json({ success: true, message: 'Simulation stopped' });
});

app.get('/api/simulation/status', (req, res) => {
  res.status(200).json({ 
    active: simulationActive,
    currentState: currentState ? 'drowsy' : 'alert',
    dataPoints: drowsinessData.length,
    alerts: alertEvents.length
  });
});

// Manual data input endpoint (to test without ML model)
app.post('/api/manual/state', (req, res) => {
  const { isDrowsy } = req.body;
  
  if (typeof isDrowsy !== 'boolean') {
    return res.status(400).json({ error: 'isDrowsy must be a boolean value' });
  }
  
  const dataPoint = {
    isDrowsy: isDrowsy,
    level: isDrowsy ? 100 : 0,
    timestamp: new Date().toISOString()
  };
  
  drowsinessData.push(dataPoint);
  
  if (dataPoint.isDrowsy) {
    alertEvents.push(dataPoint);
  }
  
  // Broadcast to all connected clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'data', data: dataPoint }));
    }
  });
  
  logInfo(`Manual state set to: ${isDrowsy ? 'DROWSY' : 'ALERT'}`);
  res.status(200).json({ success: true, message: `State set to ${isDrowsy ? 'drowsy' : 'alert'}` });
});

// WebSocket connection handler
wss.on('connection', (ws) => {
  logInfo('Client connected');
  
  // Send latest data to newly connected client
  if (drowsinessData.length > 0) {
    ws.send(JSON.stringify({ 
      type: 'history', 
      data: drowsinessData.slice(-100) // Last 100 points
    }));
  }
  
  ws.on('close', () => {
    logInfo('Client disconnected');
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'control.html'));
  });

server.listen(PORT, () => {
  logInfo(`Server running on port ${PORT}`);
});