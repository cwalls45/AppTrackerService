import AWS from "aws-sdk";
import dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid'
import { ICourseInfo } from "../entities/account";

export interface ISignUpGateway {
    getAccountRecord(accountId: string): Promise<any>;
    createShellAccount(firstName: string, lastName: string, email: string): Promise<any>;
    addCourseInfo(courseInfo: ICourseInfo, accountId: string, email: string): Promise<ICourseInfo>;
}

export class SignUpGateway implements ISignUpGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async getAccountRecord(accountId: string): Promise<any> {

        const params = {
            Key: {
                pk: accountId,
                sk: accountId,
            },
            //TODO: make table name dynamic based on environment
            TableName: 'TurfTracker-dev',
        };

        try {
            const accountRecord = await this.dynamoDb.get(params).promise();
            //Todo: find way return Item.data with correct type
            return accountRecord.Item;
        } catch (error) {
            console.log(`Error occured while getting account record: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured while getting account record: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async createShellAccount(firstName: string, lastName: string, email: string) {

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

            //TODO: refactor batch write to helper function so it can be reused
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

            const params = {
                RequestItems: {
                    'TurfTracker-dev': requestParams
                }
            };

            await this.dynamoDb.batchWrite(params).promise();

            return data;
        } catch (error) {
            console.log(`Error occured while creating shell account: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured while creating shell account: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async addCourseInfo(courseInfo: ICourseInfo, accountId: string, email: string) {

        const requestParams = [];

        try {

            const accountRecords = await this.getAccountRecord(accountId);

            const data = {
                ...accountRecords.data,
                courseInfo
            }
            //TODO: refactor batch write to helper function so it can be reused
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

            const params = {
                RequestItems: {
                    'TurfTracker-dev': requestParams
                }
            };

            await this.dynamoDb.batchWrite(params).promise();

            return data.courseInfo;
        } catch (error) {
            console.log(`Error occured while adding course info to account: ${JSON.stringify(error, null, 2)}, params: ${JSON.stringify(requestParams, null, 2)}`)
            throw new Error(`Error occured while adding course info to account: ${JSON.stringify(error, null, 2)}`);
        }
    }
}