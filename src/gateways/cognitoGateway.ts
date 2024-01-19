import AWS from 'aws-sdk';
import CognitoIdentityServiceProvider, { GetUserRequest, RevokeTokenResponse, UserType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { PromiseResult } from 'aws-sdk/lib/request';
import { ISignUp } from '../entities/auth';
import { USER_POOL, USER_POOL_CLIENT } from '../environment/path';

export interface ICognitoGateway {
    signUpUser(user: ISignUp): Promise<UserType | undefined>
    login(user: ISignUp): Promise<AWS.CognitoIdentityServiceProvider.AdminInitiateAuthResponse | AWS.AWSError>;
    getUserEmailByToken(token: string): Promise<PromiseResult<AWS.CognitoIdentityServiceProvider.GetUserResponse, AWS.AWSError>>;
    isUserAuthenticated(token: string): Promise<boolean>;
    signOut(token: string): Promise<PromiseResult<RevokeTokenResponse, AWS.AWSError>>;
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
            console.log(`CognitoGateway - Error occured in creating user: ${JSON.stringify(error, null, 2)}, ${JSON.stringify(user, null, 2)}`)
            throw new Error(`Error occured in creating user: ${JSON.stringify(error, null, 2)}, ${JSON.stringify(user, null, 2)}`);
        }
    }

    async login(user: ISignUp) {

        const { email, password } = user;

        try {

            if (!USER_POOL) {
                throw Error('USER_POOL is not defined');
            };
            if (!USER_POOL_CLIENT) {
                throw Error('USER_POOL_CLIENT is not defined');
            };

            const loggedInUser = await this.cognito.adminInitiateAuth({
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                UserPoolId: USER_POOL,
                ClientId: USER_POOL_CLIENT,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password
                }
            }).promise();

            return loggedInUser;

        } catch (error) {
            console.log(`CognitoGateway - Error occured while logging in user: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured while logging in user: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async getUserEmailByToken(token: string): Promise<PromiseResult<AWS.CognitoIdentityServiceProvider.GetUserResponse, AWS.AWSError>> {
        const params: GetUserRequest = {
            AccessToken: token
        }

        try {
            const user = await this.cognito.getUser(params).promise();

            return user;
        } catch (error) {
            console.log(`CognitoGateway - Error occured while getting user by access token: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`Error occured while getting user by access token: ${JSON.stringify(error, null, 2)}`);
        }
    }

    async isUserAuthenticated(token: string): Promise<boolean> {
        const params: GetUserRequest = {
            AccessToken: token
        }

        try {
            const user = await this.cognito.getUser(params).promise();
            console.log(`CognitoGateway User: ${JSON.stringify(user, null, 2)}`)
            return !!user;
        } catch (error) {
            console.log(`CognitoGateway: ${error}`)
            return false
        }
    }

    async signOut(token: string): Promise<PromiseResult<RevokeTokenResponse, AWS.AWSError>> {
        const params: GetUserRequest = {
            AccessToken: token
        };

        try {
            const user = await this.cognito.getUser(params).promise();
            const clientId = user.UserAttributes?.find(attribute => attribute.Name === 'sub')?.Value!;

            const signOutParams: CognitoIdentityServiceProvider.Types.RevokeTokenRequest = {
                Token: token,
                ClientId: clientId
            };

            return await this.cognito.revokeToken(signOutParams).promise();
        } catch (error) {
            console.log(`CognitoGateway - There was an error while signing out: ${JSON.stringify(error, null, 2)}`)
            throw new Error(`There was an error while signing out.`);
        }
    }
}