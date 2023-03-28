import { Request, Response } from 'express';
import Joi from 'joi';
import { ICourseInfo } from '../../entities/account';
import { CognitoGateway } from "../../gateways/cognitoGateway";
import { SignUpGateway } from "../../gateways/signUpGateway";

const addCourseInfo = async (req: Request, res: Response) => {

    const cognitoGateway = new CognitoGateway();
    const signUpGateway = new SignUpGateway();
    const { courseInfo }: { courseInfo: ICourseInfo } = req.body;

    try {

        validate(courseInfo);


    } catch (error) {
        console.log(error);
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
        throw new Error(`Unable to validate signUp properties: ${courseInfo}`);
    };
}

export default addCourseInfo;