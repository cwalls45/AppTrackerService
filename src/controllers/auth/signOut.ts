import { CognitoGateway } from '../../gateways/cognitoGateway';
import { Request, Response } from 'express';

const signOut = async (req: Request, res: Response) => {
    const cognitoGateway = new CognitoGateway();
    const { token }: { token: string } = req.body;
    try {
        await cognitoGateway.signOut(token);
        res.send({ isSignedOut: true });
    } catch (error) {
        console.log(error);
        res.status(400).send({ isSignedOut: false });
    }

}

export default signOut;
