import net from 'node:net';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';

const options: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  timeZone: 'Europe/Berlin',
};

const dateFormat = new Intl.DateTimeFormat('de-DE', options);

const PRINTER_PORT = 9100;
const HOST = '192.168.178.83';
const RECONNECT_DELAY_MS = 5000; // Initial delay before reconnecting (5 seconds)
// Optional: Add max retries or exponential backoff later if needed

let client = null;
let isConnected = false;
let isConnecting = false;
let reconnectTimeout = null;

const createClient = () => {
  console.log('[🧾 THERMAL] Creating new socket...');
  const newClient = new net.Socket();

  newClient.on('connect', () => {
    console.log('[🧾 THERMAL] Connected to printer');
    isConnected = true;
    isConnecting = false;
    // Optional: Enable TCP Keep-Alive to detect dead connections faster
    newClient.setKeepAlive(true, 60000); // Check every 60 seconds
    // If you implement print job queuing, process the queue here
  });

  newClient.on('data', (data) => {
    console.log('[🧾 THERMAL] Received:', data.toString('hex'));
    // Handle any status responses from the printer if needed
  });

  newClient.on('end', () => {
    // The other side closed the connection. 'close' will likely follow.
    console.log('[🧾 THERMAL] Printer closed connection (end event)');
    isConnected = false;
    // No need to trigger reconnect here, wait for 'close'
  });

  newClient.on('close', (hadError) => {
    console.log(`[🧾 THERMAL] Disconnected from printer${hadError ? ' due to error' : ''}.`);
    isConnected = false;
    isConnecting = false; // Ensure connecting flag is reset
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout); // Clear any pending reconnect timer
    }
    // Don't try to reconnect immediately if client.destroy() was called explicitly
    // (Add a flag for explicit destruction if needed)
    console.log(`[🧾 THERMAL] Attempting reconnect in ${RECONNECT_DELAY_MS / 1000} seconds...`);
    reconnectTimeout = setTimeout(connectPrinter, RECONNECT_DELAY_MS);
  });

  newClient.on('error', (err) => {
    console.error('[🧾 THERMAL] Socket Error:', err.message);
    // Error often precedes 'close'. Let the 'close' handler manage reconnection.
    // Explicitly destroy the socket on error to ensure cleanup and 'close' event.
    isConnecting = false; // Reset connecting flag if error happened during connect attempt
    newClient.destroy();
  });

  newClient.on('timeout', () => {
    console.log('[🧾 THERMAL] Socket timeout');
    // Often good practice to close the socket on timeout
    newClient.destroy(new Error('Socket timeout')); // Pass error to indicate reason
  });

  // Add other event listeners if needed for debugging
  // ['drain', 'lookup', 'ready'].forEach((event) => {
  //   newClient.on(event, (data) => {
  //     console.log('[🧾 THERMAL] Event:', event, data);
  //   });
  // });

  return newClient;
};

const connectPrinter = () => {
  if (isConnected || isConnecting) {
    console.log('[🧾 THERMAL] Connection attempt skipped: Already connected or connecting.');
    return;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  if (!client || client.destroyed) {
    client = createClient();
  }

  console.log('[🧾 THERMAL] Attempting to connect...');
  isConnecting = true;
  client.connect(PRINTER_PORT, HOST); // The 'connect', 'error', 'close' listeners handle the outcome
};

// --- Public API ---

// Initialize encoder (remains the same)
export const encoder = new ReceiptPrinterEncoder();

// Function to initiate the first connection
export const initializePrinterConnection = () => {
  if (!client) {
    connectPrinter();
  }
};

// Function to send data to the printer
export const printData = (data: string) => {
  return new Promise((resolve, reject) => {
    if (!isConnected || !client || client.destroyed) {
      console.error('[🧾 THERMAL] Cannot print: Printer not connected.');
      return reject(new Error('Printer not connected'));
    }

    const now = new Date();
    const time = dateFormat.format(now);

    let result = encoder.initialize().text(time).newline().text(data).newline().newline().encode();
    client.write(result);
    resolve('Done');
  });
};

export async function cutPaper() {
  let result = encoder.newline().newline().newline().newline().newline().cut('full').encode();
  client.write(result);
}

// Function to check connection status
export const isPrinterConnected = () => {
  return isConnected;
};

// Optional: Function to manually disconnect (e.g., on app shutdown)
export const disconnectPrinter = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (client && !client.destroyed) {
    console.log('[🧾 THERMAL] Manually disconnecting printer...');
    // Prevent automatic reconnection after manual disconnect
    client.removeAllListeners('close'); // Remove the auto-reconnect listener
    client.destroy();
    client = null;
    isConnected = false;
    isConnecting = false;
  }
};
