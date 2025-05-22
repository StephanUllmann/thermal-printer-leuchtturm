// import { int, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
export const dishTable = pgTable('main_dishes', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 510 }).notNull().unique(),
    image: varchar({ length: 255 }).notNull(),
    category: integer().references(() => categoriesTable.id, { onDelete: 'no action' }),
});
export const variantsTable = pgTable('variants', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: varchar({ length: 510 }).notNull(),
    mainDishId: integer().references(() => dishTable.id, { onDelete: 'no action' }),
});
export const categoriesTable = pgTable('categories', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 510 }).notNull().unique(),
});
//# sourceMappingURL=schemas.js.map