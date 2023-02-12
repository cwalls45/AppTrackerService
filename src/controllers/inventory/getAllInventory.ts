import { Request, Response } from 'express';
import { InventoryGateway } from '../../gateways/inventoryGateway';

const getAllInventory = async (req: Request, res: Response) => {
    const accountId = req.params.accountId;

    const inventoryGateway = new InventoryGateway();
    const inventory = await inventoryGateway.getAllInventory(accountId);

    res.locals.inventory = inventory;
    res.send(res.locals.inventory);
};

export default getAllInventory;