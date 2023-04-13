import { Request, Response } from 'express';
import { CognitoGateway } from '../../gateways/cognitoGateway';

const getUserByToken = async (req: Request, res: Response) => {

    const cognitoGateway = new CognitoGateway();
    const { accessToken } = req.params;

    try {

        const response = await cognitoGateway.getUserEmailByToken(accessToken);

        res.send({ userName: response.Username })

    } catch (error) {
        console.log('There was an error getting user with access token : ', JSON.stringify(error, null, 2));
        res.status(400).send({ error: `There was an error getting user with access token: ${JSON.stringify(accessToken, null, 2)}` });
    }
}

export default getUserByToken;