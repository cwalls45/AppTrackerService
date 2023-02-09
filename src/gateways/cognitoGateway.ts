import AWS from 'aws-sdk';
import { ISignUp } from '../entities/auth';

export interface ICognitoGateway {
    signUpUser(user: ISignUp): Promise<any>
}

export class CognitoGateway implements ICognitoGateway {
    private cognito = new AWS.CognitoIdentityServiceProvider();

    constructor() { }

    async signUpUser(user: ISignUp): Promise<any> {
        try {

        } catch (error) {
            console.log(`Error occured in creating user: ${JSON.stringify(error, null, 2)}, ${JSON.stringify(user, null, 2)}`)
            throw new Error(`Error occured in creating user: ${JSON.stringify(error, null, 2)}, ${JSON.stringify(user, null, 2)}`);
        }
    }
}