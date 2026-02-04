import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import type { Handler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import {
  ApiError,
  resolveTableName,
  withCreateMetadata,
  withUpdateMetadata,
} from '../../shared/utils';
import { DynamoPayload } from '../../shared/db/contracts.type';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: Handler = async (event: { payload: DynamoPayload }) => {
  const { action, table: PTable } = event.payload;
  const table = resolveTableName(PTable);

  switch (action) {
    case 'get': {
      const { key } = event.payload;
      return client.send(new GetCommand({ TableName: table, Key: key }));
    }

    case 'create': {
      const { item } = event.payload;
      const itemWithMetadata = withCreateMetadata(item);

      return client.send(
        new PutCommand({
          TableName: table,
          Item: itemWithMetadata,
          ConditionExpression: 'attribute_not_exists(id)',
        }),
      );
    }

    case 'update': {
      const { key, updateExpression, values } = event.payload;

      const itemWithMetadata = withUpdateMetadata(values);
      const ExpressionAttributeValues: Record<string, any> = {};

      for (const k in itemWithMetadata) {
        ExpressionAttributeValues[`:${k}`] =
          itemWithMetadata[k as keyof typeof itemWithMetadata];
      }

      return client.send(
        new UpdateCommand({
          TableName: table,
          Key: key,
          UpdateExpression: updateExpression,
          ExpressionAttributeValues,
        }),
      );
    }

    case 'delete': {
      const { key } = event.payload;
      return client.send(new DeleteCommand({ TableName: table, Key: key }));
    }

    default:
      throw new ApiError(
        400,
        `database-operation: Unsupported action: ${action}`,
      );
  }
};
