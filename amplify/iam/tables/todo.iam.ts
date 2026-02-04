import { AppBackend } from '../../shared/types/backend';

/**
 * Attaches IAM permissions for the Todo DynamoDB table.
 *
 * This function defines the security boundary between the Todo data model
 * and the Lambda functions that interact with it. Permissions are granted
 * following the principle of least privilege:
 *
 * - Read access (`GetItem`, `Query`, `Scan`) is granted only to the retrieval Lambda
 * - Write access (`PutItem`, `UpdateItem`, `DeleteItem`) is granted only to mutation Lambdas
 *
 * The table reference is resolved from the Amplify data resource using
 * the model name defined in the schema (`Todo`).
 *
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachTodoTablePolicies(backend: AppBackend) {
  const todoTable = backend.data.resources.tables['Todo'];

  // Read & write access to databaseOperation lambda function
  todoTable.grantWriteData(backend.databaseOperation.resources.lambda);
}
