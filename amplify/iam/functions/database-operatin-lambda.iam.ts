import { AppBackend } from '../../shared/types/backend.type';

/**
 * Grants all CRUD Lambdas permission to invoke the databaseOperation Lambda.
 *
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachDatabaseOperationLambdaPolicies(backend: AppBackend) {
  const databaseOperationLambda = backend.databaseOperation.resources.lambda;

  const crudLambdas = [
    backend.postConfirmation,
    backend.createTodo,
    backend.updateTodo,
    backend.deleteTodo,
    backend.getTodo,
  ];

  // Grant invoke permission to databaseOperation lambda function
  crudLambdas.forEach((fn) => {
    databaseOperationLambda.grantInvoke(fn.resources.lambda);
  });
}
