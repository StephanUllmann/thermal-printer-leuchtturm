import express from 'express';
import cors from 'cors';
import dishesRouter from './routes/dishesRouter.js';
import printRouter from './routes/printRouter.js';
import { initializePrinterConnection } from './lib/printer.js';

initializePrinterConnection();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/print', printRouter);

app.get('/healthy', (req, res) => {
  res.json({ msg: 'Ok' });
});

app.use('/dishes', dishesRouter);

app.use((err, req, res, next) => {
  res.status(err.cause?.statusCode ?? 500).json({ msg: err.message });
});

app.listen(port, () => `Printer server listening on port ${port}`);
