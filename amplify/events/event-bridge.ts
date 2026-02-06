import { Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as targets from 'aws-cdk-lib/aws-events-targets';

import { AppBackend } from '../shared/types/backend.type';

export function setupEventBridge(backend: AppBackend) {
  class EventBridgeInfra {
    readonly eventBus: events.EventBus;
    constructor(stack: Stack) {
      this.eventBus = new events.EventBus(stack, 'EventsBus', {
        eventBusName: 'events-bus',
      });
    }
  }

  // created stack and event bridge instance
  const eventBridgeStack = backend.createStack('EventBridgeStack');
  const eventBridge = new EventBridgeInfra(eventBridgeStack);

  const postConfirmationLambda = backend.postConfirmation.resources.lambda;

  // attach event bridge rules
  new events.Rule(eventBridgeStack, 'UserCreatedToDatabaseOperation', {
    eventBus: eventBridge.eventBus,
    eventPattern: {
      source: ['app.user'],
      detailType: ['UserCreated'],
    },
    targets: [
      new targets.LambdaFunction(backend.databaseOperation.resources.lambda),
    ],
  });

  // attach event bridge policies
  postConfirmationLambda.addToRolePolicy(
    new PolicyStatement({
      actions: ['events:PutEvents'],
      resources: [eventBridge.eventBus.eventBusArn],
    }),
  );

  // add env to post confirmation lambda to get event bus name
  backend.postConfirmation.addEnvironment(
    'EVENT_BUS_NAME',
    eventBridge.eventBus.eventBusName,
  );
}
