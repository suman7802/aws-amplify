import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import { dbClient } from '../../shared/db/client';

const cognitoClient = new CognitoIdentityProviderClient({});

/**
 * Post-Confirmation Trigger
 *
 * - Syncs Cognito user to DynamoDB
 * - Sets application status to PENDING
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { userPoolId, userName: email, request } = event;
  const { sub, name, phone_number } = request.userAttributes;

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
};
