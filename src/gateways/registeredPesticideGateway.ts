import AWS from "aws-sdk";
import dayjs from "dayjs";
import { IPesticideInformation } from "../entities/chemical";

export interface IRegisteredPesticideGateway {
    addRegisteredPesticideFromFile(pesticide: IPesticideInformation): Promise<void>;
    getRegisteredPesticidesByCompany(epaNumber: string, productName: string): Promise<any>;
    createPesticideCompanyRecord(companies: string[]): Promise<void>;
};

export class RegisteredPesticideGateway implements IRegisteredPesticideGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async addRegisteredPesticideFromFile(pesticide: IPesticideInformation): Promise<void> {
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

        try {
            await this.dynamoDb.put(params).promise();
            console.log(`RegisteredPesticideGateway - Registered Pesticide Added: ${JSON.stringify(pesticide, null, 2)}`);

        } catch (error) {
            console.log(`Error occured in adding Registered Pesticide: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in adding Registered Pesticide: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async getRegisteredPesticidesByCompany(companyName: string): Promise<any> {
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

    //should only be used when adding new companies to database or setting up new environment
    async createPesticideCompanyRecord(companies: string[]): Promise<void> {
        const params = {
            Item: {
                pk: 'registeredPesticide:companies',
                sk: 'registeredPesticide:companies',
                data: companies,
                createdAt: dayjs().utc().toISOString(),
            },
            //TODO: make table name dynamic based on environment
            TableName: 'TurfTracker-RegisteredPesticides-dev',
        };

        try {
            await this.dynamoDb.put(params).promise();
            console.log(`RegisteredPesticideGateway - Company Record created: ${JSON.stringify(params, null, 2)}`);

        } catch (error) {
            console.log(`Error occured creating company record: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured creating company record: ${JSON.stringify(error, null, 2)}`);
        }
    }
}