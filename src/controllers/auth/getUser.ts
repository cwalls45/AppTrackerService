import { Request, Response } from 'express';
import { SignUpGateway } from '../../gateways/signUpGateway';

const getUser = async (req: Request, res: Response) => {

    const signUpGateway = new SignUpGateway();
    const { email } = req.params
    try {

        const response = await signUpGateway.getAccountRecordByEmail(email);

        res.send({ accountId: response.accountId });

    } catch (error) {
        console.log('There was an error getting user account information: ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error getting user account information: ${JSON.stringify(req.body.courseInfo, null, 2)}` });
    }
}

export default getUser;