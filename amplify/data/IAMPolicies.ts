import { AppBackend } from '../shared/types/backend.type';

/**
 * Attaches IAM policies for all data resources.
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachTablePolicies(backend: AppBackend) {
  const todoTable = backend.data.resources.tables['Todo'];
  const userTable = backend.data.resources.tables['User'];

  // Grant read & write access to databaseOperation lambda function
  todoTable.grantReadWriteData(backend.databaseOperation.resources.lambda);
  userTable.grantReadWriteData(backend.databaseOperation.resources.lambda);
}
