import type { PostConfirmationTriggerEvent } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { dbClient } from '../../shared/db/client';
import { authHandler } from '../../shared/utils';

const cognitoClient = new CognitoIdentityProviderClient({});

/**
 * Post-Confirmation Trigger
 *
 * - Syncs Cognito user to DynamoDB
 * - Sets application status to PENDING
 */
export const handler = authHandler<PostConfirmationTriggerEvent>(
  async (event) => {
    const { userPoolId, userName: email, request } = event;
    const { sub, name, phone_number } = request.userAttributes;

    const domain = email.split('@')[1];
    const group = domain === 'climatecleansolutions.com' ? 'admin' : 'user';

    // adding user to cognito with status PENDING
    await cognitoClient.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
          {
            Name: 'custom:status',
            Value: 'PENDING',
          },
        ],
      }),
    );

    // adding user to cognito group
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: email,
        GroupName: group,
      }),
    );

    await dbClient({
      action: 'create',
      table: 'User',
      item: {
        name,
        email,
        id: sub,
        phone: phone_number,
      },
    });

    return event;
  },
);
