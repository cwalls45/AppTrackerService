import { Request, Response } from 'express';
import Joi from 'joi';
import { ChemicalApplicationFormProperty, ChemicalProperties, IChemicalApplicationForm } from '../../entities/chemicalApplication';
import { formatChemicalApplicationToApplicationEvent } from '../../utils/formatChemicalAppToEvent';


const createApplication = async (req: Request, res: Response) => {
    try {
        const { application } = req.body as { application: IChemicalApplicationForm };
        console.log(application)
        validate(application);
        res.locals.application = formatChemicalApplicationToApplicationEvent(application);
        //TODO: add application event and application details to database once set up
        res.send(res.locals.application);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `${error}` });
    }

};

const schema = Joi.object({
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