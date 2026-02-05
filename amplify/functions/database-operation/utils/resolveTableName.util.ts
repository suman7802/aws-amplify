import { DynamoPayload } from '../../../shared/db/contracts.type';
import { ApiError } from '../../../shared/utils/errors.util';

/**
 * Resolve the physical DynamoDB table name for a logical table key.
 *
 * This function maps logical table identifiers (e.g. "Todo", "User", "Test")
 * to their corresponding DynamoDB table names injected via environment variables.
 *
 * It throws an error if:
 * - The table key is unknown
 * - The environment variable for the table is not defined
 *
 * @param table - Logical table name from DynamoPayload
 * @returns The physical DynamoDB table name
 *
 * @example
 * ```ts
 * const tableName = resolveTableName('Todo');
 * // → amplify-todo-xyz-Todo
 * ```
 */
export function resolveTableName(table: DynamoPayload['table']): string {
  const tableMap: Record<DynamoPayload['table'], string | undefined> = {
    Todo: process.env.TODO_TABLE_NAME,
    User: process.env.USER_TABLE_NAME,
  };

  const tableName = tableMap[table];

  if (!tableName) {
    throw new ApiError(500, `Database table name not configured for: ${table}`);
  }

  return tableName;
}
