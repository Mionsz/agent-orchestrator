#!/usr/bin/env node
// Custom Next.js server wrapper that suppresses SSE "Controller already closed" errors
// These happen when SSE clients disconnect while the poll interval is still firing

const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');

// Suppress the specific unhandled rejection BEFORE loading Next
process.on('unhandledRejection', (reason) => {
  if (reason && (reason.code === 'ERR_INVALID_STATE' || 
      (reason.message && reason.message.includes('Controller is already closed')))) {
    return; // swallow SSE disconnect noise
  }
  console.error('[AO] Unhandled Rejection:', reason);
});

async function main() {
  // Dynamic import for ESM next
  const next = require('next');
  const app = next({ dev: false, dir: __dirname });
  const handle = app.getRequestHandler();
  
  await app.prepare();
  
  const port = parseInt(process.env.PORT || '55180', 10);
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });
  
  server.listen(port, () => {
    console.log(`> AO Ready on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start AO:', err);
  process.exit(1);
});
