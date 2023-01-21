import { Request, Response } from 'express';
import { IInventory } from '../../entities/inventory';
import { InventoryGateway } from '../../gateways/inventoryGateway';

const addInventory = async (req: Request, res: Response) => {
    try {
        //TODO: determine if there is already a record
        const inventoryGateway = new InventoryGateway()

        let { inventory, accountId } = req.body as { inventory: IInventory, accountId: string };
        const response = await inventoryGateway.addInventory(inventory, accountId);

        res.locals.inventory = response;
        res.send(res.locals.inventory);
    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding inventory: ${req.body.inventory.companyName}` })
    }
};

export default addInventory;