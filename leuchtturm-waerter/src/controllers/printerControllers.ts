import { cutPaper, printData } from '../lib/printer.js';

const simplePrint = async (req, res) => {
  const { text } = req.body;
  await printData(text);
  await cutPaper();
  res.json({ msg: `Printed:\n${text}` });
};

export { simplePrint };
