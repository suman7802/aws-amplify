import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { AppBackend } from '../shared/types/backend.type';

/**
 * Attaches IAM policies for all data resources using the root stack.
 * @param backend - The initialized Amplify Gen 2 backend instance.
 */
export function attachTablePolicies(backend: AppBackend) {
  const todoTable = backend.data.resources.tables['Todo'] as dynamodb.Table;
  const userTable = backend.data.resources.tables['User'] as dynamodb.Table;
  const dbLambda = backend.databaseOperation.resources
    .lambda as lambda.Function;

  const tableAccessStatement = new iam.PolicyStatement({
    actions: [
      'dynamodb:PutItem',
      'dynamodb:GetItem',
      'dynamodb:UpdateItem',
      'dynamodb:DeleteItem',
      'dynamodb:Query',
      'dynamodb:Scan',
      'dynamodb:BatchWriteItem',
      'dynamodb:BatchGetItem',
      'dynamodb:ConditionCheckItem',
    ],
    resources: [todoTable.tableArn, userTable.tableArn],
  });

  if (dbLambda.role) {
    dbLambda.role.attachInlinePolicy(
      new iam.Policy(backend.stack, 'DBLambdaTableAccessPolicy', {
        statements: [tableAccessStatement],
      }),
    );
  }
}
