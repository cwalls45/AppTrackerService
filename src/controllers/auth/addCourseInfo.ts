import { Request, Response } from 'express';
import Joi from 'joi';
import { ICourseInfo } from '../../entities/account';
import { SignUpGateway } from "../../gateways/signUpGateway";

const addCourseInfo = async (req: Request, res: Response) => {

    const signUpGateway = new SignUpGateway();
    const { courseInfo, accountId, email }: { courseInfo: ICourseInfo, accountId: string, email: string } = req.body;

    try {

        validate(courseInfo);

        const response = await signUpGateway.addCourseInfo(courseInfo, accountId, email);

        res.send({ courseInfo: response });

    } catch (error) {
        console.log('There was an error adding user information to account: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error adding user information to account: ${JSON.stringify(req.body.courseInfo, null, 2)}` });
    }
}

const schema = Joi.object({
    courseName: Joi.string().required(),
    address1: Joi.string().required(),
    address2: Joi.string(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    state: Joi.string().required(),
});

const validate = (courseInfo: ICourseInfo) => {
    const { error } = schema.validate(courseInfo);
    if (error) {
        throw new Error(`Unable to validate courseInfo properties: ${courseInfo}`);
    };
}

export default addCourseInfo;