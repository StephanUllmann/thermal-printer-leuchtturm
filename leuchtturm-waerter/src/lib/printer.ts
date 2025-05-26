import net from 'node:net';
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { printersTable } from '../db/schemas.js';

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
let PRINTER_IP = '192.168.178.83';
const RECONNECT_DELAY_MS = 5000; // Initial delay before reconnecting (5 seconds)
// Optional: Add max retries or exponential backoff later if needed

let client = null;
let isConnected = false;
let isConnecting = false;
let reconnectTimeout: NodeJS.Timeout | null = null;

export const setPrinterIp = (ip: string) => {
  PRINTER_IP = ip;
};

export const printerIsConnected = () => {
  return isConnected;
};

const createClient = async () => {
  // console.log('[🧾 THERMAL] Creating new socket...');

  // const data = await db.select({ ip: printersTable.ip }).from(printersTable).where(eq(printersTable.id, 1));
  // PRINTER_IP = data[0].ip ?? '192.168.178.83';
  try {
    const data = await db.select({ ip: printersTable.ip }).from(printersTable).where(eq(printersTable.id, 1));
    if (data && data.length > 0 && data[0].ip) {
      PRINTER_IP = data[0].ip;
      // console.log(`[🧾 THERMAL] Using printer IP from DB: ${PRINTER_IP}`);
    } else {
      console.warn(`[🧾 THERMAL] No IP found in DB or DB error, using default/previous: ${PRINTER_IP}`);
    }
  } catch (dbError) {
    console.error('[🧾 THERMAL] Error fetching printer IP from DB:', dbError);
    // Continue with the current PRINTER_IP as a fallback
  }

  const newClient = new net.Socket();

  newClient.on('connect', () => {
    console.log('[🧾 THERMAL] Connected to printer');
    isConnected = true;
    isConnecting = false;
    // Optional: Enable TCP Keep-Alive to detect dead connections faster
    newClient.setKeepAlive(true, 60000); // Check every 60 seconds
    // If you implement print job queuing, process the queue here
    if (reconnectTimeout) {
      // Clear any pending reconnect timeout on successful connection
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  });

  newClient.on('data', (data) => {
    console.log('[🧾 THERMAL] Received:', data.toString('hex'));
    // Handle any status responses from the printer if needed
  });

  newClient.on('end', () => {
    // The other side closed the connection. 'close' will likely follow.
    // console.log('[🧾 THERMAL] Printer closed connection (end event)');
    isConnected = false;
    // No need to trigger reconnect here, wait for 'close'
  });

  // newClient.on('close', (hadError) => {
  //   console.log(`[🧾 THERMAL] Disconnected from printer${hadError ? ' due to error' : ''}.`);
  //   isConnected = false;
  //   isConnecting = false; // Ensure connecting flag is reset
  //   if (reconnectTimeout) {
  //     clearTimeout(reconnectTimeout); // Clear any pending reconnect timer
  //   }
  //   // Don't try to reconnect immediately if client.destroy() was called explicitly
  //   // (Add a flag for explicit destruction if needed)
  //   console.log(`[🧾 THERMAL] Attempting reconnect in ${RECONNECT_DELAY_MS / 1000} seconds...`);
  //   reconnectTimeout = setTimeout(connectPrinter, RECONNECT_DELAY_MS);
  // });

  newClient.on('close', (hadError) => {
    console.log(`[🧾 THERMAL] Disconnected from printer${hadError ? ' due to error' : ''}.`);
    isConnected = false;
    isConnecting = false;
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    reconnectTimeout = setTimeout(connectPrinterInternal, RECONNECT_DELAY_MS);
    // Schedule reconnection only if this 'close' event is still attached (i.e., not manually disconnected)
    // And ensure client object is the one this listener was attached to.
    // if (client === newClient && !client.destroyed && client.listenerCount('close') > 0) {
    //   // console.log(`[🧾 THERMAL] Attempting reconnect in ${RECONNECT_DELAY_MS / 1000} seconds...`);
    // } else if (client && client.destroyed) {
    //   console.log('[🧾 THERMAL] Client was destroyed, no automatic reconnect scheduled by this instance.');
    //   reconnectTimeout = setTimeout(connectPrinterInternal, RECONNECT_DELAY_MS);
    // }
  });

  newClient.on('error', (err) => {
    console.error('[🧾 THERMAL] Socket Error:', err.message);
    // Error often precedes 'close'. Let the 'close' handler manage reconnection.
    // Explicitly destroy the socket on error to ensure cleanup and 'close' event.
    isConnecting = false; // Reset connecting flag if error happened during connect attempt
    newClient.destroy();
  });

  newClient.on('timeout', () => {
    // console.log('[🧾 THERMAL] Socket timeout');
    // Often good practice to close the socket on timeout
    newClient.destroy(new Error('Socket timeout')); // Pass error to indicate reason
  });
  newClient.on('ready', () => {
    isConnected = true;
  });

  // Add other event listeners if needed for debugging
  // ['drain', 'lookup', 'ready'].forEach((event) => {
  //   newClient.on(event, (data) => {
  //     console.log('[🧾 THERMAL] Event:', event, data);
  //   });
  // });

  return newClient;
};

// const connectPrinter = async () => {
//   if (isConnected || isConnecting) {
//     console.log('[🧾 THERMAL] Connection attempt skipped: Already connected or connecting.');
//     return;
//   }

//   if (reconnectTimeout) {
//     clearTimeout(reconnectTimeout);
//     reconnectTimeout = null;
//   }

//   if (!client || client.destroyed) {
//     client = await createClient();
//   }

//   console.log('[🧾 THERMAL] Attempting to connect...');
//   isConnecting = true;
//   client.connect(PRINTER_PORT, PRINTER_IP); // The 'connect', 'error', 'close' listeners handle the outcome
//   await new Promise((resolve) =>
//     setTimeout(() => {
//       resolve('Done');
//     }, 75)
//   );
// };

// Internal connect function for automatic reconnections
const connectPrinterInternal = async () => {
  if (isConnected || isConnecting) {
    // console.log('[🧾 THERMAL] Internal Reconnect: Skipped, already connected or connecting.');
    return;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  isConnecting = true;
  console.log('[🧾 THERMAL] Internal Reconnect: Attempting to connect...');
  try {
    // If client is old or destroyed, create a new one.
    // createClient will fetch the latest IP.
    if (!client || client.destroyed) {
      client = await createClient();
    }
    // IP for connection is now handled by createClient
    client.connect(PRINTER_PORT, PRINTER_IP);
    // State (isConnected, isConnecting) will be updated by client's event handlers.
  } catch (error) {
    console.error('[🧾 THERMAL] Error during internal reconnect attempt:', error);
    isConnecting = false; // Reset on error
    // The 'error' or 'close' event on the socket should handle further state.
    // Schedule another attempt if appropriate, or let the 'close' handler do it.
    if (client && client.listenerCount('close') > 0) {
      // Check if eligible for auto-reconnect
      reconnectTimeout = setTimeout(connectPrinterInternal, RECONNECT_DELAY_MS);
    }
  }
};

// Public connect function, returns a Promise
const connectPrinter = (): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    // If there's an existing client, destroy it to ensure a fresh connection attempt,
    // especially important if IP might have changed.
    if (client && !client.destroyed) {
      console.log('[🧾 THERMAL] Connect: Destroying existing client before new connection attempt.');
      await new Promise<void>((r) => {
        client!.once('close', () => {
          r();
        });
        client!.destroy();
      });
      client = null; // Ensure createClient makes a new one
    }

    // if (isConnected) {
    //   console.log('[🧾 THERMAL] Connect: Already connected.');
    //   return resolve();
    // }
    if (isConnecting) {
      console.warn('[🧾 THERMAL] Connect: Connection attempt already in progress. Waiting for it to resolve or fail.');
      // This part can be improved with a shared promise for the ongoing attempt.
      // For now, we'll reject to prevent stacking. Or let the caller decide to retry.
      return reject(new Error('Connection attempt already in progress.'));
    }

    if (reconnectTimeout) {
      // Clear any scheduled automatic reconnect if a manual one is initiated
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    isConnecting = true;
    // console.log('[🧾 THERMAL] Connect: Attempting to connect (manual/initial)...');

    try {
      client = await createClient(); // createClient is async and sets up persistent listeners & gets IP

      const onConnect = () => {
        // isConnected and isConnecting are set by the persistent 'connect' handler
        cleanupListeners();
        resolve();
      };

      const onError = (err: Error) => {
        // isConnecting is reset by persistent 'error' or 'close' handler
        cleanupListeners();
        reject(err);
      };

      const onClose = (hadError?: boolean) => {
        // This 'close' is for the *current* connection attempt failing *before* 'connect'
        if (isConnecting) {
          // Only reject if we were in the process of this specific connection attempt
          cleanupListeners();
          reject(new Error(`Connection failed: Socket closed ${hadError ? 'with error' : 'unexpectedly'}`));
        }
        // If 'close' happens after successful 'connect', this promise is already resolved.
        // The persistent 'close' handler manages isConnected and global auto-reconnection.
      };

      const cleanupListeners = () => {
        client!.removeListener('connect', onConnect);
        client!.removeListener('error', onError);
        client!.removeListener('close', onClose);
      };

      // Use 'once' for these promise-specific listeners for this connection attempt
      client.once('connect', onConnect);
      client.once('error', onError);
      client.once('close', onClose); // Catches connect failures that result in immediate close

      // PRINTER_IP is set by createClient now
      client.connect(PRINTER_PORT, PRINTER_IP);
    } catch (error) {
      console.error('[🧾 THERMAL] Connect: Error during setup for connection:', error);
      isConnecting = false;
      reject(error);
    }
  });
};

// --- Public API ---

// Initialize encoder (remains the same)
export const encoder = new ReceiptPrinterEncoder();

// Function to initiate the first connection
// export const initializePrinterConnection = async () => {
//   if (!client) {
//     await connectPrinter();
//   } else {
//     disconnectPrinter();
//     await connectPrinter();
//   }
// };
export const initializePrinterConnection = async () => {
  // console.log('[🧾 THERMAL] Initializing printer connection...');
  try {
    await connectPrinter(); // Now correctly waits for connection outcome
    // console.log('[🧾 THERMAL] Printer connection process completed.');
    // isConnected will be updated by event handlers; printerIsConnected() will reflect it.
  } catch (error: any) {
    console.error('[🧾 THERMAL] Failed to initialize printer connection:', error.message);
    // isConnected will be false due to error/close handlers
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

    let result = encoder
      .initialize()
      .size(2)
      .font('B')
      .bold(true)
      .line(time)
      .bold(false)
      .line(data)
      .newline(2)
      .encode();
    client.write(result);
    resolve('Done');
  });
};
export const printTable = (data: any) => {
  return new Promise((resolve, reject) => {
    if (!isConnected || !client || client.destroyed) {
      console.error('[🧾 THERMAL] Cannot print: Printer not connected.');
      return reject(new Error('Printer not connected'));
    }

    const now = new Date();
    const time = dateFormat.format(now);

    let result = encoder
      .initialize()
      .newline(2)
      .font('B')
      .size(3)
      .underline(true)
      .line(time)
      .underline(false)
      .size(1)
      .newline()
      .bold(true)
      .size(2, 2)
      .table(
        [
          { width: 22, marginRight: 3, align: 'left' },
          { width: 5, align: 'right', verticalAlign: 'bottom' },
        ],
        data
          .reduce((acc, val) => {
            acc.push(val);
            acc.push(['', '']);
            return acc;
          }, [])
          .map(([title, count]) => [title, count])
        // data
      )
      .size(1, 1)
      .bold(false)
      .newline(4)
      .encode();
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
    // Prevent automatic reconnection after manual disconnect
    client.removeAllListeners('close'); // Remove the auto-reconnect listener
    client.destroy();
    client = null;
    isConnected = false;
    isConnecting = false;
  }
};
