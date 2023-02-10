import { Request, Response } from 'express';
import Joi from 'joi';
import { ISignUp } from '../../entities/auth';
import { CognitoGateway } from '../../gateways/cognitoGateway';

const signUp = async (req: Request, res: Response) => {

    const cognitoGateway = new CognitoGateway()

    try {
        const { signUp }: { signUp: ISignUp } = req.body;

        validate(signUp);

        await cognitoGateway.signUpUser(signUp);

        res.send('TEST')

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `There was an error signing up user: ${JSON.stringify(req.body.signUp, null, 2)}` });
    }
}

const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

const validate = (signUp: ISignUp) => {
    const { error } = schema.validate(signUp);
    if (error) {
        throw new Error(`Unable to validate signUp properties: ${signUp}`);
    };
}

export default signUp;