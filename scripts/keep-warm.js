// scripts/keep-warm.js
// Simple keep‑warm script for a Render service.
// It repeatedly sends a GET request to the service URL so the free tier instance never becomes idle.
//
// Usage:
//   npm run keep-warm   # runs continuously (Ctrl‑C to stop)
//
// To run on Render as a background worker, add a second service (type: worker) that
// executes "npm run keep-warm". The worker will stay alive and keep pinging the main
// web service.

const https = require('https');
const url = process.env.TARGET_URL || 'https://<YOUR‑RENDER‑SERVICE>.onrender.com'; // replace with your actual URL

function ping() {
  https.get(url, res => {
    console.log(`[${new Date().toISOString()}] Ping ${url} → ${res.statusCode}`);
    // Drain response data to avoid socket hang‑up.
    res.resume();
  }).on('error', err => {
    console.error(`[${new Date().toISOString()}] Ping error:`, err.message);
  });
}

// Initial ping immediately
ping();
// Repeat every 4 minutes (Render free tier idle timeout is ~15 min)
setInterval(ping, 4 * 60 * 1000);

