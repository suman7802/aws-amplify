import { AppBackend } from '../../shared/types/backend.type';
import { attachTodoTablePolicies } from './todo.iam';
import { attachUserTablePolicies } from './user.iam';

/**
 * Attaches IAM permissions for all DynamoDB tables.
 *
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachTablePolicies(backend: AppBackend) {
  attachTodoTablePolicies(backend);
  attachUserTablePolicies(backend);
}
