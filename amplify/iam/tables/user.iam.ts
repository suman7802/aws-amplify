import { AppBackend } from '../../shared/types/backend.type';

/**
 * Attaches IAM permissions for the User DynamoDB table.
 *
 * This function defines the security boundary between the User data model
 * and the Lambda functions that interact with it. Permissions are granted
 * following the principle of least privilege:
 *
 * - Read access (`GetItem`, `Query`, `Scan`) is granted only to the retrieval Lambda
 * - Write access (`PutItem`, `UpdateItem`, `DeleteItem`) is granted only to mutation Lambdas
 *
 * The table reference is resolved from the Amplify data resource using
 * the model name defined in the schema (`User`).
 *
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachUserTablePolicies(backend: AppBackend) {
  const userTable = backend.data.resources.tables['User'];

  // Read & write access to databaseOperation lambda function
  userTable.grantReadWriteData(backend.databaseOperation.resources.lambda);
}
