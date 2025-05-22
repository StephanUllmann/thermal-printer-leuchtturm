import express from 'express';
const dishesRouter = express.Router();
dishesRouter.get('/', async (req, res) => {
    const result = await db.select().from(dishTable).leftJoin(variantsTable, eq(dishTable.id, variantsTable.mainDishId));
    res.json({ msg: 'Dishes', result });
});
dishesRouter.post('/', async (req, res) => {
    const { title, image } = req.body;
    const result = await db.insert(dishTable).values({ title, image });
    console.log(result);
    res.json({ msg: 'Dish added', result });
});
dishesRouter.post('/:dishId/variants', async (req, res) => {
    const { dishId } = req.params;
    const { title } = req.body;
    const result = await db.insert(variantsTable).values({ title, mainDishId: dishId });
    console.log(result);
    res.json({ msg: 'Variant added', result });
});
dishesRouter.delete('/:dishId/variants/:variantsId', async (req, res) => {
    const { variantsId } = req.params;
    const result = await db.delete(variantsTable).where(eq(variantsTable.id, variantsId));
    console.log(result);
    res.json({ msg: 'Variant deleted' });
});
export default dishesRouter;
//# sourceMappingURL=dishesPouter.js.map