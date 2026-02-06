import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { DynamoPayload } from './contracts.type';
import { logger } from '../logger';

const lambda = new LambdaClient({});

/**
 * Sends a payload to the DB Gateway Lambda and returns the response.
 * All upstream functions call this wrapper, never InvokeCommand directly.
 */
export async function dbClient(payload: DynamoPayload) {
  const dbLambdaName =
    process.env.DB_LAMBDA_NAME ||
    'amplify-todo-sumansharma--databaseoperationlambda1-vFZ9kzKAXU7C'; // useing this for now (debug purpose)

  logger.database.info(`DB Lambda Name ${dbLambdaName}`);
  logger.database.info(`DB Client called with payload ${payload}`);

  const response = await lambda.send(
    new InvokeCommand({
      FunctionName: dbLambdaName,
      Payload: Buffer.from(JSON.stringify({ payload })),
    }),
  );

  return JSON.parse(Buffer.from(response.Payload!).toString());
}
