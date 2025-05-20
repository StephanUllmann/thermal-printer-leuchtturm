import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';

export const dishTable = sqliteTable('main_dishes', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  image: text().notNull(),
  category: int().references(() => categoriesTable.id, { onDelete: 'no action' }),
});

export const variantsTable = sqliteTable('variants', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  mainDishId: int().references(() => dishTable.id, { onDelete: 'no action' }),
});

export const categoriesTable = sqliteTable('categories', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export type InsertDish = typeof dishTable.$inferInsert;
export type SelectDish = typeof dishTable.$inferSelect;

export type InsertVariant = typeof variantsTable.$inferInsert;
export type SelectVariant = typeof variantsTable.$inferSelect;

export type InsertCategory = typeof categoriesTable.$inferInsert;
export type SelectCategory = typeof categoriesTable.$inferSelect;
