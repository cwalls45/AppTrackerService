import { Request, Response } from 'express';
import { IInventory } from '../../entities/inventory';
import { InventoryGateway } from '../../gateways/inventoryGateway';
import { isEmpty } from 'lodash';
import { canUnitsBeAddedTogether, convertInventoryUnits } from '../../utils/convertInventoryUnits';

const addInventory = async (req: Request, res: Response) => {
    try {
        const inventoryGateway = new InventoryGateway();
        let addInventoryresponse: IInventory;

        let { inventory, accountId } = req.body as { inventory: IInventory, accountId: string };
        //Todo: use joi validation to validate inventory

        const getInventoryResponse = await inventoryGateway.getInventoryItem(inventory, accountId);

        const convertedInventory = convertInventoryUnits(inventory);

        if (isEmpty(getInventoryResponse)) {
            addInventoryresponse = await inventoryGateway.addInventory(convertedInventory, accountId);
        } else {
            canInventoriesBeCombined(convertedInventory, getInventoryResponse.data);

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
        console.log('ERROR in addInventory.ts: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding inventory: ${req.body.inventory.companyName}` })
    }
};

const canInventoriesBeCombined = (inventory: IInventory, existingInventory: IInventory) => {
    const isCompatible = canUnitsBeAddedTogether(inventory, existingInventory);

    if (!isCompatible) {
        throw new Error(`Can not add inventory(${inventory.units}) to existingInventory(${existingInventory.units})`)
    }
}

export default addInventory;