import { Request, Response } from 'express';
import Joi from 'joi';
import { IInventory, InventoryProperty } from '../../entities/inventory';
import { InventoryGateway } from '../../gateways/inventoryGateway';
import { isEmpty } from 'lodash';
import { averageCost, canUnitsBeAddedTogether, convertInventoryUnits } from '../../utils/convertInventoryUnits';


const addInventory = async (req: Request, res: Response) => {
    try {
        const inventoryGateway = new InventoryGateway();
        let addInventoryresponse: IInventory;

        let { inventory, accountId } = req.body as { inventory: IInventory, accountId: string };

        validate(inventory);

        const getInventoryResponse = await inventoryGateway.getInventoryItem(inventory, accountId);

        const convertedInventory = convertInventoryUnits(inventory);

        if (isEmpty(getInventoryResponse)) {
            addInventoryresponse = await inventoryGateway.addInventory(convertedInventory, accountId);
        } else {
            canInventoriesBeCombined(convertedInventory, getInventoryResponse.data);
            const cost = averageCost(convertedInventory, getInventoryResponse.data);
            const combinedAmount = Number(getInventoryResponse.data.amount) + Number(convertedInventory.amount);
            const inventoryWithNewAmount = {
                ...convertedInventory,
                amount: combinedAmount.toString(),
                cost
            }

            addInventoryresponse = await inventoryGateway.addInventory(inventoryWithNewAmount, accountId);
        }

        res.locals.inventory = addInventoryresponse;
        res.send(res.locals.inventory);
    } catch (error) {
        console.log('ERROR adding inventory: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding inventory: ${JSON.stringify(req.body.inventory, null, 2)}` });
    }
};

const canInventoriesBeCombined = (inventory: IInventory, existingInventory: IInventory) => {
    const isCompatible = canUnitsBeAddedTogether(inventory, existingInventory);

    if (!isCompatible) {
        throw new Error(`Can not add inventory(${inventory.units}) to existingInventory(${existingInventory.units})`)
    }
};

const schema = Joi.object({
    [InventoryProperty.CHEMICAL_NAME]: Joi.string().required(),
    [InventoryProperty.COMPANY_NAME]: Joi.string().required(),
    [InventoryProperty.AMOUNT]: Joi.string().pattern(/^[0-9]+$/).required(),
    [InventoryProperty.UNITS]: Joi.string().required(),
    [InventoryProperty.COST]: Joi.string().pattern(/^[0-9]+$/).required(),
    [InventoryProperty.COST_UNIT]: Joi.string().required(),
});

const validate = (inventory: IInventory) => {
    const { error } = schema.validate(inventory);
    if (error) {
        throw new Error(`Unable to validate properties of inventory: ${error}`);
    };
}

export default addInventory;