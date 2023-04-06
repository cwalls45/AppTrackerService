import { Request, Response } from 'express';
import Joi from 'joi';
import { ICourseArea } from '../../entities/account';
import { SignUpGateway } from "../../gateways/signUpGateway";

const addCourseAreas = async (req: Request, res: Response) => {

    const signUpGateway = new SignUpGateway();
    const { courseAreas, accountId, email }: { courseAreas: ICourseArea[], accountId: string, email: string } = req.body;

    try {

        validate(courseAreas);

        const courseAreasResponse = await signUpGateway.addCourseAreas(courseAreas, accountId, email);

        res.send({ courseAreas: courseAreasResponse });

    } catch (error) {
        console.log('There was an error adding course areas to account: ', JSON.stringify(error, null, 2), 'Course Areas: ', JSON.stringify(courseAreas, null, 2));
        res.status(400).send({ error: `There was an error adding course areas to account: ${JSON.stringify(courseAreas, null, 2)}` });
    }
}

const schema = Joi.array().items(
    Joi.object({
        area: Joi.string().required(),
        size: Joi.string().required(),
        sizeUnit: Joi.string().required(),
        turfType: Joi.string().required(),
    }));

const validate = (courseAreas: ICourseArea[]) => {
    const { error } = schema.validate(courseAreas);
    if (error) {
        throw new Error(`Unable to validate courseAreas properties: ${courseAreas}`);
    };
}

export default addCourseAreas;