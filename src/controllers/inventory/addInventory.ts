import { Request, Response } from 'express';
import { IInventory } from '../../entities/inventory';
import { InventoryGateway } from '../../gateways/inventoryGateway';
import { isEmpty } from 'lodash';
import { convertInventoryUnits } from '../../utils/convertInventoryUnits';

const addInventory = async (req: Request, res: Response) => {
    try {

        let addInventoryresponse: IInventory;
        //TODO: determine if there is already a record
        const inventoryGateway = new InventoryGateway()

        let { inventory, accountId } = req.body as { inventory: IInventory, accountId: string };

        const getInventoryResponse = await inventoryGateway.getInventoryItem(inventory, accountId);
        console.log('getInventoryResponse', getInventoryResponse)

        //Todo: convert inventory and combine with response from get request
        const convertedInventory = convertInventoryUnits(inventory);

        if (isEmpty(getInventoryResponse)) {
            addInventoryresponse = await inventoryGateway.addInventory(convertedInventory, accountId);
        } else {
            //Todo: edit existing record, add inventory to existing record
            return convertedInventory
        }

        res.locals.inventory = addInventoryresponse;
        res.send(res.locals.inventory);
    } catch (error) {
        console.log(JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding inventory: ${req.body.inventory.companyName}` })
    }
};

export default addInventory;