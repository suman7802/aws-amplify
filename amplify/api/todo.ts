import { LambdaIntegration, IResource } from 'aws-cdk-lib/aws-apigateway';
import { AppBackend } from '../shared/types/backend';

/**
 * Configures the '/todos' resource tree.
 * * Pattern:
 * - GET/POST /v0/todos          : Collection operations
 * - GET/PUT/DELETE /v0/todos/id : Single item operations
 * * @param root - The parent API Gateway resource (typically /v0).
 * @param backend - Access to Todo-related Lambda integrations.
 */
export function configureTodoRoutes(root: IResource, backend: AppBackend) {
  const createInt = new LambdaIntegration(backend.createTodo.resources.lambda);
  const getInt = new LambdaIntegration(backend.getTodo.resources.lambda);
  const updateInt = new LambdaIntegration(backend.updateTodo.resources.lambda);
  const deleteInt = new LambdaIntegration(backend.deleteTodo.resources.lambda);

  // Collection level
  root.addMethod('POST', createInt);
  root.addMethod('GET', getInt);

  // Individual item level
  const item = root.addResource('{id}');
  item.addMethod('GET', getInt);
  item.addMethod('PUT', updateInt);
  item.addMethod('DELETE', deleteInt);
}
