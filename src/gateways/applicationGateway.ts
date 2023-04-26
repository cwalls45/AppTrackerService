import AWS from 'aws-sdk';
import dayjs from "dayjs";
import { IApplicationSummary } from '../entities/application';
import { IApplication } from "../entities/chemicalApplication";
import { formatChemicalApplicationToApplicationEvent } from "../utils/formatChemicalAppToEvent";

export interface IApplicationGateway {
    createApplication(application: IApplication, accountId: string): Promise<IApplication>;
    createApplicationEvent(application: IApplication, accountId: string): Promise<IApplicationSummary>;
    getApplicationEventsByYear(year: number, accountId: string): Promise<any>;
    getApplicationsByYear(year: number, accountId: string): Promise<any>;
}

export class ApplicationGateway implements IApplicationGateway {

    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async createApplication(application: IApplication, accountId: string): Promise<IApplication> {

        try {
            const params = {
                Item: {
                    pk: `application:${accountId}:${dayjs().year()}`,
                    sk: `application:${application.dateOfApplication}:${application.id}`,
                    data: application,
                    createdAt: dayjs().utc().toISOString(),
                },
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-dev',
            };
            await this.dynamoDb.put(params).promise();
            console.log(`ApplicationGateway - Application created: ${JSON.stringify(application, null, 2)}`);

            return application;
        } catch (error) {
            console.log(`Error occured in creating application: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in creating application: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async createApplicationEvent(application: IApplication, accountId: string): Promise<IApplicationSummary> {

        try {
            const applicationEvent = formatChemicalApplicationToApplicationEvent(application);
            const applicationEventForDynamo = {
                ...applicationEvent,
                start: dayjs(applicationEvent.start).toISOString(),
                end: dayjs(applicationEvent.end).toISOString(),
            }

            const params = {
                Item: {
                    pk: `applicationEvent:${accountId}:${dayjs().year()}`,
                    sk: `applicationEvent:${application.dateOfApplication}:${application.id}`,
                    data: applicationEventForDynamo,
                    createdAt: dayjs().utc().toISOString(),
                },
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-dev'
            };
            await this.dynamoDb.put(params).promise();
            console.log(`ApplicationGateway - Application Event created: ${JSON.stringify(applicationEvent, null, 2)}`);

            return applicationEvent;
        } catch (error) {
            console.log(`Error occured in creating application event: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in creating application event: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async getApplicationEventsByYear(year: number, accountId: string): Promise<any> {
        try {
            const params = {
                //TODO: make table name dynamic based on environment
                TableName: 'TurfTracker-dev',
                KeyConditionExpression: "pk = :pk",
                ExpressionAttributeValues: {
                    ":pk": `applicationEvent:${accountId}:${year}`,
                },
            };
            // TODO: make sure there is not a more efficent way to get all application events
            const applicationEvents = await this.dynamoDb.query(params).promise();
            //TODO: revist below to make this more clear
            console.log('ApplicationGateway - applictationEvents: ', JSON.stringify(applicationEvents, null, 2))

            return applicationEvents.Items?.map((appEvent) => ({
                ...appEvent.data
            }));
        } catch (error) {
            console.log(`Error occured in fetching application event: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in fetching application event: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async getApplicationsByYear(year: number, accountId: string): Promise<any> {

        const params = {
            //TODO: make table name dynamic based on environment
            TableName: 'TurfTracker-dev',
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": `application:${accountId}:${year}`,
            },
        };

        try {
            const applications = await this.dynamoDb.query(params).promise();

            //TODO: revist below to make this more clear
            console.log('ApplicationGateway - applications: ', JSON.stringify(applications, null, 2))
            return applications.Items?.map(app => ({
                ...app.data
            }));
        } catch (error) {
            console.log(`Error occured in fetching applications: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in fetching applications: ${JSON.stringify(error, null, 2)}`);
        }
    }
}