import { eq, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { categoriesTable, dishTable, variantsTable } from '../db/schemas.js';
import { Request, Response } from 'express';
interface Variant {
  id: number;
  title: string;
  mainDishId: number;
}

const getAllDishes = async (req: Request, res: Response) => {
  // const result = await db
  //   .select()
  //   .from(dishTable)
  //   .leftJoin(variantsTable, eq(dishTable.id, variantsTable.mainDishId))
  //   .leftJoin(categoriesTable, eq(dishTable.category, categoriesTable.id));
  const result = await db
    .select({
      main_dishes: {
        id: dishTable.id,
        title: dishTable.title,
        image: dishTable.image,
        category: dishTable.category, // This is the category ID
      },
      variants: sql<Variant[]>`(
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'id', ${variantsTable.id},
            'title', ${variantsTable.title},
            'mainDishId', ${variantsTable.mainDishId}
          )
        ),
        '[]'::json
      )
      FROM ${variantsTable}
      WHERE ${eq(variantsTable.mainDishId, dishTable.id)}
    )`.as('variants'), // Name the resulting field 'variants'
      categories: {
        id: categoriesTable.id,
        name: categoriesTable.name,
      },
    })
    .from(dishTable)
    .leftJoin(categoriesTable, eq(dishTable.category, categoriesTable.id));
  res.json({ msg: 'Dishes', result });
};

const createDish = async (req: Request & { file: any }, res: Response) => {
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file.public_id;
  const result = await db.insert(dishTable).values({ title, image, category });
  res.json({ msg: 'Dish added', result, image: req.file.secure_url });
};

const updateDish = async (req, res) => {
  const { dishId } = req.params;
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file?.public_id;

  const result = await db.update(dishTable).set({ title, image, category }).where(eq(dishTable.id, dishId));
  res.json({ msg: 'Dish updated', result, image: req.file });
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

export { getAllDishes, createDish, createVariant, deleteVariant, getCategories, createCategory, updateDish };
