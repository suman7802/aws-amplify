import { APIGatewayProxyEvent } from 'aws-lambda';
import { ApiError } from './errors';

export interface UserInfo {
  userId: string;
  username: string;
  groups: string[];
  isAuthenticated: boolean;
}

/**
 * Private helper to normalize Cognito groups (can be a comma-separated string or an array).
 */
function parseGroups(rawGroups: any): string[] {
  if (Array.isArray(rawGroups)) return rawGroups;
  if (typeof rawGroups === 'string')
    return rawGroups.split(',').map((g) => g.trim());
  return [];
}

/**
 * Extracts and standardizes Cognito user information from the API Gateway event.
 * * @param {APIGatewayProxyEvent} event - The Lambda proxy event from API Gateway.
 * @returns {UserInfo} The normalized user information.
 * @throws {ApiError} 401 unauthenticated if claims are missing.
 */
export const getUserInfo = (event: APIGatewayProxyEvent): UserInfo => {
  const claims = event.requestContext.authorizer?.claims;

  if (!claims || !claims.sub) throw new ApiError(401, 'unauthenticated');

  const rawGroups = claims['cognito:groups'];
  const groups: string[] = parseGroups(rawGroups);

  return {
    userId: claims.sub,
    username: claims['cognito:username'] || claims.username || 'unknown',
    groups,
    isAuthenticated: true,
  };
};
