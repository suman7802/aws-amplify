import { RestApi, LambdaIntegration, Cors, IResource } from 'aws-cdk-lib/aws-apigateway';
import { AppBackend } from '../shared/types/backend';
import { configureTodoRoutes } from './todo';

/**
 * Main entry point for API Gateway configuration.
 * * This function orchestrates the creation of the REST API and delegates
 * resource creation to domain-specific functions. It uses a versioning
 * strategy (/v0) to allow for non-breaking future updates.
 * * @param backend - The Amplify backend instance containing Lambda resources.
 * @throws Will throw an error if the required Lambda resources are missing from the backend object.
 */
export function setupApiGateway(backend: AppBackend) {
  const apiStack = backend.createStack('AppApiStack');

  /**
   * Initialize the REST API.
   * Default CORS is applied to all resources to allow cross-origin requests from the frontend.
   */
  const api = new RestApi(apiStack, 'AppApi', {
    restApiName: 'CoreAppApi',
    description: 'Main REST API for Todo and User management.',
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
  });

  // Base path for the current API version
  const v0 = api.root.addResource('v0');

  // Register domain-specific sub-resources
  configureTodoRoutes(v0.addResource('todos'), backend);

  /**
   * Export metadata for frontend discovery.
   * These values are written to 'amplify_outputs.json'.
   */
  backend.addOutput({
    custom: {
      api_url: api.url,
      api_name: api.restApiName,
    },
  });
}
