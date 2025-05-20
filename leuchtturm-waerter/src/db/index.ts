// import { createClient } from '@libsql/client';
// import { drizzle } from 'drizzle-orm/libsql';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.PG_URL);

// const client = createClient({
//   url: 'file:db-file.db',
//   syncUrl: process.env.TURSO_DATABASE_URL,
//   authToken: process.env.TURSO_AUTH_TOKEN,
//   offline: true,
// });
// async function dbInit() {
//   console.log('Syncing database ...');
//   await db.sync();

//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS main_dishes (
//       ID INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       img TEXT NOT NULL
//     );
//   `);
//   await db.execute(`
//     CREATE TABLE IF NOT EXISTS variants (
//       ID INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       main_dish_id INTEGER NOT NULL,

//       FOREIGN KEY (main_dish_id)
//         REFERENCES main_dishes(ID)
//         ON DELETE CASCADE
//         ON UPDATE CASCADE
//     );
//   `);

//   return db;
// }

// const db = drizzle({
//   connection: {
//     url: process.env.TURSO_DATABASE_URL,
//     authToken: process.env.TURSO_AUTH_TOKEN,
//   },
//   // client,
// });

export { db };
