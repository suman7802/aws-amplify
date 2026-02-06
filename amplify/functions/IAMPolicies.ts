import { AppBackend } from '../shared/types/backend.type';

/**
 * Attaches IAM policies for all lambda functions.
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachFunctionPolicies(backend: AppBackend) {
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
