import { attachTablePolicies } from './data/IAMPolicies';
import { attachFunctionPolicies } from './functions/IAMPolicies';
import { AppBackend } from './shared/types/backend.type';

/**
 * Attaches IAM policies for all backend resources.
 *
 * This function acts as the central IAM orchestration layer for the backend.
 * It delegates resource-specific permission assignments (e.g. DynamoDB tables)
 * to isolated IAM modules, ensuring:
 *
 * - Clear separation of concerns
 * - Least-privilege access for Lambda functions
 * - Easy extensibility as new resources are added
 *
 * Each imported `attach*Policies` function is responsible for defining
 * the security relationship between a single resource (table, bucket, etc.)
 * and the Lambda functions that interact with it.
 *
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function IAMPolicies(backend: AppBackend) {
  attachTablePolicies(backend);
  attachFunctionPolicies(backend);
}
