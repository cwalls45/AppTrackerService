import AWS from "aws-sdk";
import dayjs from "dayjs";
import { IPesticideInformation } from "../entities/chemical";

export interface IRegisteredPesticideGateway {
    addRegisteredPesticideFromFile(pesticide: IPesticideInformation): Promise<void>;
    getRegisteredPesticidesByCompany(epaNumber: string, productName: string): Promise<any>;
};

export class RegisteredPesticideGateway implements IRegisteredPesticideGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async addRegisteredPesticideFromFile(pesticide: IPesticideInformation): Promise<void> {

        try {
            const params = {
                Item: {
                    pk: `registeredPesticide:${pesticide.companyInformation.companyName}`,
                    sk: `registeredPesticide:${pesticide.epaRegistrationNumber}`,
                    data: pesticide,
                    createdAt: dayjs().utc().toISOString(),
                },
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-RegisteredPesticides-dev',
            };
            await this.dynamoDb.put(params).promise();
            console.log(`RegisteredPesticideGateway - Registered Pesticide Added: ${JSON.stringify(pesticide, null, 2)}`);

        } catch (error) {
            console.log(`Error occured in adding Registered Pesticide: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in adding Registered Pesticide: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async getRegisteredPesticidesByCompany(epaNumber: string, companyName: string): Promise<any> {
        const params = {
            //TODO: make table name dynamic based on environment
            TableName: 'TurfTracker-RegisteredPesticides-dev',
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": `registeredPesticide:${companyName}`,
            },
        };

        try {
            const response = await this.dynamoDb.query(params).promise();
            console.log(`RegisteredPesticideGateway - Registered Pesticides fetched: ${JSON.stringify(response, null, 2)}`);

            return response.Items?.map(res => ({
                ...res.data
            }));

        } catch (error) {
            console.log(`Error occured in fetching Registered Pesticides: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in fetching Registered Pesticides: ${JSON.stringify(error, null, 2)}`);
        }
    }
}