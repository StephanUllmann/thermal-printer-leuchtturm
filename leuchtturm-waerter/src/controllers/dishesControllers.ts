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
  // console.log('--------------<>----------------');
  // console.log(result);
  // console.log('<--------------<>---------------->');
  res.json(result);
};

const createDish = async (req: Request & { file: any }, res: Response) => {
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file.public_id;
  await db.insert(dishTable).values({ title, image, category });
  await getAllDishes(req, res);
};

const updateDish = async (req, res) => {
  const { dishId } = req.params;
  const title = req.body.title;
  const category = req.body.category;
  const image = req.file?.public_id;

  await db.update(dishTable).set({ title, image, category }).where(eq(dishTable.id, dishId));
  // res.json({ msg: 'Dish updated', result, image: req.file });
  await getAllDishes(req, res);
};

const createVariant = async (req, res) => {
  const { dishId } = req.params;
  const { title } = req.body;
  await db.insert(variantsTable).values({ title, mainDishId: dishId });
  await getAllDishes(req, res);
};

const deleteVariant = async (req, res) => {
  const { variantsId } = req.params;
  await db.delete(variantsTable).where(eq(variantsTable.id, variantsId));
  // res.json({ msg: 'Variant deleted' });
  await getAllDishes(req, res);
};

const getCategories = async (req, res) => {
  const result = await db.select().from(categoriesTable);
  res.json(result);
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  await db.insert(categoriesTable).values({ name });
  // console.log(result);
  await getCategories(req, res);
};

export { getAllDishes, createDish, createVariant, deleteVariant, getCategories, createCategory, updateDish };
