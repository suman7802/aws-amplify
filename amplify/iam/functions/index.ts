import { AppBackend } from '../../shared/types/backend.type';
import { attachDatabaseOperationLambdaPolicies } from './database-operatin-lambda.iam';

/**
 * Attaches IAM permissions for lambda functions
 *
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachFunctionPolicies(backend: AppBackend) {
  attachDatabaseOperationLambdaPolicies(backend);
}
