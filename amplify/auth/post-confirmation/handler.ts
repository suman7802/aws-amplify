import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
  AdminAddUserToGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider';

import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';

const cognitoClient = new CognitoIdentityProviderClient({});
const eventBridgeClient = new EventBridgeClient({});

/**
 * Post-Confirmation Trigger
 *
 * - Syncs Cognito user to DynamoDB
 * - Sets application status to PENDING
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
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

  // publishing event to event bridge
  await eventBridgeClient.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: process.env.EVENT_BUS_NAME!,
          Source: 'app.user',
          DetailType: 'UserCreated',
          Detail: JSON.stringify({
            action: 'create',
            table: 'User',
            item: {
              name,
              email,
              id: sub,
              phone: phone_number,
            },
          }),
        },
      ],
    }),
  );

  return event;
};
