import express from 'express';
import { simplePrint, printOrder } from '../controllers/printerControllers.js';
const printRouter = express.Router();
printRouter.post('/', simplePrint);
printRouter.post('/order', printOrder);
export default printRouter;
//# sourceMappingURL=printRouter.js.map