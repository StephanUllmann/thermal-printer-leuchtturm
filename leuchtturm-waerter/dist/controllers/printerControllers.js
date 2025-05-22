import { cutPaper, printData, printTable } from '../lib/printer.js';
const simplePrint = async (req, res) => {
    const { text } = req.body;
    await printData(text);
    await cutPaper();
    res.json({ msg: `Printed:\n${text}` });
};
const printOrder = async (req, res) => {
    await printTable(req.body);
    await cutPaper();
    res.json({ msg: `Printed` });
};
export { simplePrint, printOrder };
//# sourceMappingURL=printerControllers.js.map