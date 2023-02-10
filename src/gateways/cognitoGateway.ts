import AWS from 'aws-sdk';
import { UserType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { ISignUp } from '../entities/auth';
import { USER_POOL } from '../environment/path';

export interface ICognitoGateway {
    signUpUser(user: ISignUp): Promise<UserType | undefined>
}

export class CognitoGateway implements ICognitoGateway {
    private cognito = new AWS.CognitoIdentityServiceProvider();

    constructor() { }

    async signUpUser(user: ISignUp): Promise<UserType | undefined> {

        const { email, password } = user;
        try {
            if (!USER_POOL) {
                throw Error('USER_POOL is no defined');
            }

            const userName = await this.cognito.adminCreateUser({
                UserPoolId: USER_POOL,
                Username: email,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: email
                    },
                    {
                        Name: 'email_verified',
                        Value: 'true'
                    }
                ]
            }).promise();

            if (userName.User) {
                await this.cognito.adminSetUserPassword({
                    Password: password,
                    UserPoolId: USER_POOL,
                    Username: email,
                    Permanent: true
                }).promise();
            };

            return userName.User;

        } catch (error) {
            console.log(`Error occured in creating user: ${JSON.stringify(error, null, 2)}, ${JSON.stringify(user, null, 2)}`)
            throw new Error(`Error occured in creating user: ${JSON.stringify(error, null, 2)}, ${JSON.stringify(user, null, 2)}`);
        }
    }
}