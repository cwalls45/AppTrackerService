import { Request, Response } from 'express';
import Joi from 'joi';
import { ISignUp } from '../../entities/auth';
import { CognitoGateway } from '../../gateways/cognitoGateway';
import { SignUpGateway } from '../../gateways/signUpGateway';

const createUser = async (req: Request, res: Response) => {

    const cognitoGateway = new CognitoGateway();
    const signUpGateway = new SignUpGateway();

    try {
        const { signUp }: { signUp: ISignUp } = req.body;

        validate(signUp);

        const cognitoResult = await cognitoGateway.signUpUser(signUp);

        if (!cognitoResult) {
            res.status(400).send(`Failed to create user: ${signUp.email}`);
        }

        const signUpResult = await signUpGateway.createShellAccount(signUp.firstName, signUp.lastName, signUp.email);
        console.log('signupUpResult: ', JSON.stringify(signUpResult, null, 2))

        const loggedInUser = await cognitoGateway.login(signUp);

        res.send({ user: loggedInUser.AuthenticationResult, accountInfo: signUpResult });

    } catch (error) {
        console.log('There was an error signing up user: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error signing up user: ${JSON.stringify(req.body.signUp, null, 2)}` });
    }
}

const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30).regex(/[A-Z]/, 'upperCase')
        .regex(/[a-z]/, 'lowerCase').required(),
});

const validate = (signUp: ISignUp) => {
    const { error } = schema.validate(signUp);
    if (error) {
        throw new Error(`Unable to validate signUp properties: ${signUp}`);
    };
}

export default createUser;