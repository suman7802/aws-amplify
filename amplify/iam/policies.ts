import { AppBackend } from '../shared/types/backend';

/**
 * Manages IAM policy assignments for the backend resources.
 * * This function defines the security relationship between data storage (DynamoDB)
 * and the compute layer (Lambda). It ensures each CRUD function has the minimum
 * necessary permissions to perform its specific task.
 * * @param backend - The initialized Amplify backend instance.
 */
export function IAMPolicies(backend: AppBackend) {
  /**
   * Reference to the DynamoDB todo defined in the data resource.
   * Note: Ensure the key matches the model name defined in your schema.
   */
  const todoTable = backend.data.resources.tables['Todo'];

  /**
   * Grant Read-Only permissions to the retrieval function.
   * This covers 'GetItem', 'Query', and 'Scan' operations.
   */
  todoTable.grantReadData(backend.getTodo.resources.lambda);

  /**
   * Grant Write permissions to the mutation functions.
   * This allows 'PutItem', 'UpdateItem', and 'DeleteItem' operations.
   */
  todoTable.grantWriteData(backend.createTodo.resources.lambda);
  todoTable.grantWriteData(backend.updateTodo.resources.lambda);
  todoTable.grantWriteData(backend.deleteTodo.resources.lambda);
}
