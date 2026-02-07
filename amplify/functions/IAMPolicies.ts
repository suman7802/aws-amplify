import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { AppBackend } from '../shared/types/backend.type';

/**
 * Attaches IAM policies for all lambda functions using the root stack
 * to avoid circular dependencies between individual stacks.
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachFunctionPolicies(backend: AppBackend) {
  const databaseOperationLambda = backend.databaseOperation.resources.lambda as lambda.Function;

  const crudLambdas = [backend.createTodo, backend.updateTodo, backend.deleteTodo, backend.getTodo, backend.postConfirmation].map(
    (fn) => fn.resources.lambda as lambda.Function,
  );

  // Define the policy statement for invoking the databaseOperation lambda
  const invokeStatement = new iam.PolicyStatement({
    actions: ['lambda:InvokeFunction'],
    resources: [databaseOperationLambda.functionArn],
  });

  // Attach the policy directly to the roles of the lambdas
  crudLambdas.forEach((fn) => {
    if (fn.role) {
      fn.role.attachInlinePolicy(
        new iam.Policy(backend.stack, `${fn.node.id}InvokeDBPolicy`, {
          statements: [invokeStatement],
        }),
      );
    }
  });
}
