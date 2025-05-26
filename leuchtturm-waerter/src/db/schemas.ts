// import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { pgTable, serial, text, varchar, integer } from 'drizzle-orm/pg-core';

export const dishTable = pgTable('main_dishes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 510 }).notNull().unique(),
  image: varchar({ length: 255 }).notNull(),
  category: integer().references(() => categoriesTable.id, { onDelete: 'cascade' }),
});

export const variantsTable = pgTable('variants', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 510 }).notNull(),
  mainDishId: integer().references(() => dishTable.id, { onDelete: 'cascade' }),
});

export const categoriesTable = pgTable('categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 510 }).notNull().unique(),
});

export const printersTable = pgTable('printers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ip: varchar({ length: 510 }).notNull().unique(),
});

export type InsertDish = typeof dishTable.$inferInsert;
export type SelectDish = typeof dishTable.$inferSelect;

export type InsertVariant = typeof variantsTable.$inferInsert;
export type SelectVariant = typeof variantsTable.$inferSelect;

export type InsertCategory = typeof categoriesTable.$inferInsert;
export type SelectCategory = typeof categoriesTable.$inferSelect;
