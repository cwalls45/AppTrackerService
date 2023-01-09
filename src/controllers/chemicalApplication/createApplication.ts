import { Request, Response } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDb } from '../../index';
import { ChemicalApplicationFormProperty, ChemicalProperties, IChemicalApplicationForm } from '../../entities/chemicalApplication';
import { formatChemicalApplicationToApplicationEvent } from '../../utils/formatChemicalAppToEvent';
import dayjs from 'dayjs';
import utc from "dayjs/plugin/utc";


const createApplication = async (req: Request, res: Response) => {
    try {
        dayjs.extend(utc)
        let { application } = req.body as { application: IChemicalApplicationForm };

        if (!application.id) {
            const id = `application-${uuidv4()}`;
            application = { id, ...application };
        }

        console.log(application)
        validate(application);
        //TODO: add application event and application details to database once set up
        //TODO: get accoundId and make table name dynamic
        const params = {
            Item: {
                pk: `application:accountId-${uuidv4()}:${dayjs().year()}`,
                sk: `application:${application.dateOfApplication}:${application.id}`,
                data: application,
                createdAt: dayjs().utc().toISOString(),
            },
            TableName: 'TurfTracker-dev',

        }
        const response = await dynamoDb.put(params).promise();

        res.locals.application = formatChemicalApplicationToApplicationEvent(application);
        res.send(res.locals.application);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `${error}` });
    }

};

const schema = Joi.object({
    [ChemicalApplicationFormProperty.ID]: Joi.string().required(),
    [ChemicalApplicationFormProperty.DATE_OF_APPLICATION]: Joi.string().required(),
    [ChemicalApplicationFormProperty.AREA_OF_APPLICATION]: Joi.array().items(Joi.string()).required(),
    [ChemicalApplicationFormProperty.TOTAL_AREA_OF_APP]: Joi.string().pattern(/^[0-9]+$/).required(),
    [ChemicalApplicationFormProperty.TOTAL_AREA_OF_APP_UNIT]: Joi.string().required(),
    [ChemicalApplicationFormProperty.TARGET_PESTS]: Joi.array().items(Joi.string()).required(),
    [ChemicalApplicationFormProperty.CHEMICALS]: Joi.array().items(Joi.object({
        [ChemicalProperties.CHEMICAL_COMPANY]: Joi.string().required(),
        [ChemicalProperties.CHEMICAL_NAME]: Joi.string().required(),
        [ChemicalProperties.AMOUNT]: Joi.string().pattern(/^[0-9]+$/).required(),
        [ChemicalProperties.UNITS]: Joi.string().required()
    })),
});

const validate = (application: IChemicalApplicationForm) => {
    const { error } = schema.validate(application);
    if (error) {
        throw new Error(`Unable to validate properties of application: ${error}`);
    };
}

export default createApplication;