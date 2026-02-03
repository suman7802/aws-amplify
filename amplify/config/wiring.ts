import { AppBackend } from '../shared/types/backend';

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
}
