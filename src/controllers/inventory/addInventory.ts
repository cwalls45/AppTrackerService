import { Request, Response } from 'express';
import { IInventory } from '../../entities/inventory';
import { InventoryGateway } from '../../gateways/inventoryGateway';
import { isEmpty } from 'lodash';
import { convertInventoryUnits } from '../../utils/convertInventoryUnits';

const addInventory = async (req: Request, res: Response) => {
    try {

        let addInventoryresponse: IInventory;

        const inventoryGateway = new InventoryGateway()

        let { inventory, accountId } = req.body as { inventory: IInventory, accountId: string };

        const getInventoryResponse = await inventoryGateway.getInventoryItem(inventory, accountId);

        //Todo: check to make sure amount units can be converted to correct unit

        const convertedInventory = convertInventoryUnits(inventory);

        if (isEmpty(getInventoryResponse)) {
            addInventoryresponse = await inventoryGateway.addInventory(convertedInventory, accountId);
        } else {
            const combinedAmount = Number(getInventoryResponse.data.amount) + Number(convertedInventory.amount);
            const inventoryWithNewAmount = {
                ...convertedInventory,
                amount: combinedAmount.toString()
            }
            addInventoryresponse = await inventoryGateway.addInventory(inventoryWithNewAmount, accountId);
        }

        res.locals.inventory = addInventoryresponse;
        res.send(res.locals.inventory);
    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding inventory: ${req.body.inventory.companyName}` })
    }
};

export default addInventory;