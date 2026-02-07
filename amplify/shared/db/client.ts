import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { DynamoPayload } from './contracts.type';
import { logger } from '../logger';

const lambda = new LambdaClient({});

/**
 * Sends a payload to the DB Gateway Lambda and returns the response.
 * All upstream functions call this wrapper, never InvokeCommand directly.
 *
 * @param payload - The payload to send to the DB Gateway Lambda.
 * @returns The response from the DB Gateway Lambda.
 */
export async function dbClient(payload: DynamoPayload) {
  logger.database.info(`DB Client called with payload ${payload}`);

  const response = await lambda.send(
    new InvokeCommand({
      FunctionName: process.env.DB_LAMBDA_NAME!,
      Payload: Buffer.from(JSON.stringify({ payload })),
    }),
  );

  return JSON.parse(Buffer.from(response.Payload!).toString());
}
