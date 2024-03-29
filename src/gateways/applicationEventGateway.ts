import AWS from 'aws-sdk';
import dayjs from "dayjs";
import { IApplication } from '../entities/application';
import { IChemicalApplicationForm } from "../entities/chemicalApplication";
import { formatChemicalApplicationToApplicationEvent } from "../utils/formatChemicalAppToEvent";

export interface IApplicationGateway {
    createApplication(application: IChemicalApplicationForm, accountId: string): Promise<IChemicalApplicationForm>;
    createApplicationEvent(application: IChemicalApplicationForm, accountId: string): Promise<IApplication>;
    getApplicationEventsByYear(year: number, accountId: string): Promise<any>;
}

export class ApplicationEventGateway implements IApplicationGateway {

    dynamoDb = new AWS.DynamoDB.DocumentClient();

    constructor() { }

    async createApplication(application: IChemicalApplicationForm, accountId: string): Promise<IChemicalApplicationForm> {

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
            console.log(`Application created: ${JSON.stringify(application, null, 2)}`);

            return application;
        } catch (error) {
            console.log(`Error occured in creating application: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in creating application: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async createApplicationEvent(application: IChemicalApplicationForm, accountId: string): Promise<IApplication> {

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
            console.log(`Application Event created: ${JSON.stringify(applicationEvent, null, 2)}`);

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
            console.log('applictationEvent', JSON.stringify(applicationEvents, null, 2))

            return applicationEvents.Items?.map((appEvent) => ({
                ...appEvent.data
            }));
        } catch (error) {
            console.log(`Error occured in fetching application event: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured in fetching application event: ${JSON.stringify(error, null, 2)}`);
        }
    }
}