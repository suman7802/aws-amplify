import { AppBackend } from '../shared/types/backend.type';

/**
 * Synchronizes and injects resource-specific environment variables into Lambda functions.
 * * This function acts as the "wiring" layer to ensure that functions have the
 * necessary metadata (like Bucket names or Table ARNs) to interact with
 * other AWS resources in the Amplify backend.
 * * @param backend - The initialized Amplify backend object containing all resources.
 */
export function wiring(backend: AppBackend) {
  /**
   * sync the env
   */
  backend.generateUploadUrl.addEnvironment(
    'MEDIA_BUCKET',
    backend.storage.resources.bucket.bucketName,
  );

  const crudLambdas = [
    // backend.postConfirmation,
    backend.createTodo,
    backend.updateTodo,
    backend.deleteTodo,
    backend.getTodo,
  ];

  // add env to all lambdas that need to call db
  crudLambdas.forEach((fn) => {
    fn.addEnvironment(
      'DB_LAMBDA_NAME',
      backend.databaseOperation.resources.lambda.functionName,
    );
  });

  // add env to db lambda to get table names
  backend.databaseOperation.addEnvironment(
    'TODO_TABLE_NAME',
    backend.data.resources.tables['Todo'].tableName,
  );
  backend.databaseOperation.addEnvironment(
    'USER_TABLE_NAME',
    backend.data.resources.tables['User'].tableName,
  );
}
