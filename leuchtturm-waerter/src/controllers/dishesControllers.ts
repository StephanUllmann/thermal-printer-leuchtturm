import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { categoriesTable, dishTable, variantsTable } from '../db/schemas.js';
import { Request, Response } from 'express';

const getAllDishes = async (req: Request, res: Response) => {
  const result = await db
    .select()
    .from(dishTable)
    .leftJoin(variantsTable, eq(dishTable.id, variantsTable.mainDishId))
    .leftJoin(categoriesTable, eq(dishTable.category, categoriesTable.id));
  res.json({ msg: 'Dishes', result });
};

const createDish = async (req, res) => {
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file.public_id;
  const result = await db.insert(dishTable).values({ title, image, category });
  res.json({ msg: 'Dish added', result, image: req.file.secure_url });
};

const createVariant = async (req, res) => {
  const { dishId } = req.params;
  const { title } = req.body;
  const result = await db.insert(variantsTable).values({ title, mainDishId: dishId });
  res.json({ msg: 'Variant added', result });
};

const deleteVariant = async (req, res) => {
  const { variantsId } = req.params;
  await db.delete(variantsTable).where(eq(variantsTable.id, variantsId));
  res.json({ msg: 'Variant deleted' });
};

const getCategories = async (req, res) => {
  const result = await db.select().from(categoriesTable);
  res.json({ msg: 'Categories', result });
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const result = await db.insert(categoriesTable).values({ name });
  console.log(result);
  res.json({ msg: 'Category added', name });
};

export { getAllDishes, createDish, createVariant, deleteVariant, getCategories, createCategory };
