import AWS from "aws-sdk";
import dayjs from "dayjs";
import { IInventory } from "../entities/inventory";

export interface IInventoryGateway {
    addInventory(inventory: IInventory, accountId: string): Promise<IInventory>;
}

export class InventoryGateway implements IInventoryGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async addInventory(inventory: IInventory, accountId: string): Promise<IInventory> {

        try {
            const params = {
                Item: {
                    pk: `inventory:${accountId}`,
                    sk: `inventory:${inventory.companyName}:${inventory.chemicalName}`,
                    data: inventory,
                    createdAt: dayjs().utc().toISOString(),
                },
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-dev',
            };
            await this.dynamoDb.put(params).promise();
            console.log(`Inventory Added: ${JSON.stringify(inventory, null, 2)}`);

            return inventory;
        } catch (error) {
            console.log(`Error occured in adding inventory: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in adding inventory: ${JSON.stringify(error, null, 2)}`);
        }
    }
}