// @ts-nocheck
import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { logger } from '../../shared/logger';
import { DynamoPayload } from '../../shared/db/contracts';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

/**
 * Gateway Lambda for database operations.
 *
 * This Lambda acts as a **thin forwarding layer** between upstream functions
 * and the database (currently DynamoDB). It receives a payload that specifies
 * the target table, action, and required parameters, then executes the
 * corresponding DynamoDB command.
 *
 * Supported actions:
 * - `get` → retrieves an item by key
 * - `put` → inserts a new item
 * - `update` → updates an item with a full update expression
 * - `patch` → updates an item partially (semantically partial update)
 * - `delete` → deletes an item by key
 *
 * @param event - The Lambda event containing the payload:
 *   ```ts
 *   {
 *     payload: DynamoPayload
 *   }
 *   ```
 * @param context - Lambda execution context (used for logging/debugging)
 * @returns - Result of the DynamoDB command
 *
 * @example
 * ```ts
 * const payload = {
 *   table: 'Todo',
 *   action: 'put',
 *   item: { id: '123', title: 'Learn AWS' }
 * };
 * ```
 */
export const handler: Handler = async (event: { payload: DynamoPayload }, context) => {
  const { action, table } = event.payload;
  logger.dbOperation.info(`database operation ${action} on ${table}`);

  const commandMap = {
    get: GetCommand,
    put: PutCommand,
    update: UpdateCommand,
    delete: DeleteCommand,
    patch: UpdateCommand,
  } as const;

  const Command = commandMap[action];

  /**
   * Remove fields that are only used for routing and mapping
   * DynamoDB SDK commands do not accept "action" or "table" as parameters
   */
  const params = { TableName: table, ...event.payload };

  /**
   * remove "action" & "table" so the DynamoDB command receives only valid keys
   */
  delete params.action;
  delete params.table;

  return client.send(new Command(params));
};
