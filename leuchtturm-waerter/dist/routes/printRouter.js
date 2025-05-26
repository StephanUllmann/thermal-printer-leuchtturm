import express from 'express';
import { simplePrint, printOrder, getPrinterIpFromDB, changeIp } from '../controllers/printerControllers.js';
const printRouter = express.Router();
printRouter.post('/', simplePrint);
printRouter.post('/order', printOrder);
printRouter.get('/ip', getPrinterIpFromDB);
printRouter.post('/ip', changeIp);
export default printRouter;
//# sourceMappingURL=printRouter.js.map