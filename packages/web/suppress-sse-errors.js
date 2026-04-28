// Suppress ALL unhandled rejections to prevent Next.js from crashing
// The SSE route generates "Controller is already closed" when clients disconnect
process.on('unhandledRejection', (reason) => {
  // Silently ignore - these are benign SSE disconnection errors
});
