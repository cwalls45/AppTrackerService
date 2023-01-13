import { Request, Response } from 'express';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { ChemicalApplicationFormProperty, ChemicalProperties, IChemicalApplicationForm } from '../../entities/chemicalApplication';
import { ApplicationEventGateway } from '../../gateways/applicationEventGateway';

const createApplication = async (req: Request, res: Response) => {

    const applicationEventGateway = new ApplicationEventGateway();
    let { application, accountId } = req.body as { application: IChemicalApplicationForm, accountId: string };

    if (!application.id) {
        const id = `application-${uuidv4()}`;
        application = { id, ...application };
    }

    validate(application);

    //TODO: add application event and application details to database once set up
    await applicationEventGateway.createApplication(application, accountId);
    const applicationEventResponse = await applicationEventGateway.createApplicationEvent(application, accountId);

    res.locals.application = applicationEventResponse;
    res.send(res.locals.application);
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