import AWS from "aws-sdk";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid'

export interface ISignUpGateway {
    createShellAccount(firstName: string, lastName: string, email: string): Promise<any>;

}

export class SignUpGateway implements ISignUpGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async createShellAccount(firstName: string, lastName: string, email: string): Promise<any> {

        const requestParams = [];
        try {
            const accountId = `account:${uuidv4()}`;
            const data = {
                accountId,
                user: {
                    firstName,
                    lastName,
                    email
                }
            }

            requestParams.push({
                PutRequest: {
                    Item: {
                        pk: `${email}`,
                        sk: `${accountId}`,
                        data,
                        createdAt: dayjs().utc().toISOString(),
                    }
                }
            });

            requestParams.push({
                PutRequest: {
                    Item: {
                        pk: `${accountId}`,
                        sk: `${accountId}`,
                        data,
                        createdAt: dayjs().utc().toISOString(),
                    }
                }
            });

            let params = {
                RequestItems: {
                    'TurfTracker-dev': requestParams
                }
            };


            // const params = {
            //     Item: {
            //         pk: `${email}`,
            //         sk: `${accountId}`,
            //         data,
            //         createdAt: dayjs().utc().toISOString(),
            //     },
            //     //TODO: make table name dynamic based on environment
            //     TableName: 'TurfTracker-dev',
            // };
            // await this.dynamoDb.put(params).promise();
            // console.log(`SignUpGateway - Shell account created: ${JSON.stringify(params, null, 2)}`);

            await this.dynamoDb.batchWrite(params);

            return data;
        } catch (error) {
            console.log(`Error occured while creating shell account: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured while creating shell account: ${JSON.stringify(error, null, 2)}`);
        }
    }
}