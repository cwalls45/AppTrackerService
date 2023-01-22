import AWS from "aws-sdk";
import dayjs from "dayjs";
import { IInventory } from "../entities/inventory";
import { removeWhiteSpace } from "../utils/removeWhiteSpace";

export interface IInventoryGateway {
    addInventory(inventory: IInventory, accountId: string): Promise<IInventory>;
    getInventoryItem(inventory: IInventory, accountId: string): Promise<IInventory>;
}

export class InventoryGateway implements IInventoryGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async addInventory(inventory: IInventory, accountId: string): Promise<IInventory> {

        try {
            const { companyName, chemicalName } = inventory;
            const companyNameForKeys = removeWhiteSpace(companyName);
            const chemicalNameForKeys = removeWhiteSpace(chemicalName);

            const params = {
                Item: {
                    pk: `inventory:${accountId}`,
                    sk: `inventory:${companyNameForKeys}:${chemicalNameForKeys}`,
                    data: inventory,
                    createdAt: dayjs().utc().toISOString(),
                },
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-dev',
            };
            await this.dynamoDb.put(params).promise();
            console.log(`InventoryGateway - Inventory Added: ${JSON.stringify(inventory, null, 2)}`);

            return inventory;
        } catch (error) {
            console.log(`Error occured in adding inventory: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in adding inventory: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async getInventoryItem(inventory: IInventory, accountId: string): Promise<IInventory> {
        try {
            let { companyName, chemicalName } = inventory;
            const companyNameForKeys = removeWhiteSpace(companyName);
            const chemicalNameForKeys = removeWhiteSpace(chemicalName);

            const params = {
                Key: {
                    pk: `inventory:${accountId}`,
                    sk: `inventory:${companyNameForKeys}:${chemicalNameForKeys}`,
                },
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-dev',
            };

            const inventoryResponse = await this.dynamoDb.get(params).promise();
            console.log(`InventoryGateway - Inventory fetched: ${JSON.stringify(inventoryResponse, null, 2)}`);

            return inventoryResponse.Item as IInventory;

        } catch (error) {
            console.log(`Error occured in fetching inventory item: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in fetching inventory item: ${JSON.stringify(error, null, 2)}`);
        }
    }
}