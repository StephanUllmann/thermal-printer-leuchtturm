import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { printersTable } from '../db/schemas.js';
import { cutPaper, initializePrinterConnection, printData, printerIsConnected, printTable, setPrinterIp, } from '../lib/printer.js';
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
const getPrinterIpFromDB = async (req, res) => {
    const data = await db.select({ ip: printersTable.ip }).from(printersTable).where(eq(printersTable.id, 1));
    const ip = data[0].ip;
    const isConnected = printerIsConnected();
    res.json({ ip, isConnected });
};
const changeIp = async (req, res) => {
    const { ip } = req.body;
    const data = await db.update(printersTable).set({ ip }).where(eq(printersTable.id, 1));
    if (data.rowCount !== 1) {
        return res.status(500).json({ msg: 'Update failed' });
    }
    setPrinterIp(ip);
    await initializePrinterConnection();
    const isConnected = printerIsConnected();
    res.json({ msg: `Printer IP updated`, ip, isConnected });
};
export { simplePrint, printOrder, getPrinterIpFromDB, changeIp };
//# sourceMappingURL=printerControllers.js.map