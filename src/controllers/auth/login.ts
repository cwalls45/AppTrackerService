
import { Request, Response } from 'express';
import Joi from 'joi';
import { ISignUp } from "../../entities/auth";
import { CognitoGateway } from "../../gateways/cognitoGateway";

const login = async (req: Request, res: Response) => {

    const cognitoGateway = new CognitoGateway()

    try {
        const { user }: { user: ISignUp } = req.body;

        validate(user);

        const loggedInUser = await cognitoGateway.login(user);

        if (!loggedInUser) {
            res.status(400).send(`Failed to login user: ${user.email}`);
        }

        res.send({ user: loggedInUser.AuthenticationResult });

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: `There was an error logging in user: ${JSON.stringify(req.body.signUp, null, 2)}` });
    }
}

const schema = Joi.object({
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

export default login;