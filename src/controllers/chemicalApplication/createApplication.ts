import { Request, Response } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationProperty, ChemicalProperties, IApplication } from '../../entities/chemicalApplication';
import { ApplicationGateway } from '../../gateways/applicationGateway';

const createApplication = async (req: Request, res: Response) => {

    const applicationEventGateway = new ApplicationGateway();
    let { application, accountId } = req.body as { application: IApplication, accountId: string };

    if (!application.id) {
        const id = `application-${uuidv4()}`;
        application = { id, ...application };
    }

    const validationResult = validate(application);
    if (validationResult.error) {
        return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    await applicationEventGateway.createApplication(application, accountId);
    const applicationEventResponse = await applicationEventGateway.createApplicationEvent(application, accountId);

    res.send({ applicationEvent: applicationEventResponse });
};

const schema = Joi.object({
    [ApplicationProperty.ID]: Joi.string().required(),
    [ApplicationProperty.DATE_OF_APPLICATION]: Joi.string().required(),
    [ApplicationProperty.AREA_OF_APPLICATION]: Joi.array().items(Joi.string()).required(),
    [ApplicationProperty.TOTAL_AREA_OF_APP]: Joi.string().pattern(/^[1-9]\d*(\.\d+)?$/).required(),
    [ApplicationProperty.TOTAL_AREA_OF_APP_UNIT]: Joi.string().required(),
    [ApplicationProperty.TARGET_PESTS]: Joi.array().items(Joi.string()).required(),
    [ApplicationProperty.CHEMICALS]: Joi.array().items(Joi.object({
        [ChemicalProperties.CHEMICAL_COMPANY]: Joi.string().required(),
        [ChemicalProperties.CHEMICAL_NAME]: Joi.string().required(),
        [ChemicalProperties.AMOUNT]: Joi.string().pattern(/^[1-9]\d*(\.\d+)?$/).required(),
        [ChemicalProperties.UNITS]: Joi.string().required()
    })),
});

const validate = (application: IApplication) => {
    return schema.validate(application);
}

export default createApplication;