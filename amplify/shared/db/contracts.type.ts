import { TodoType, UserType } from '../../data/schema';

export type TableItemMap = {
  Todo: Omit<TodoType['Todo']['type'], 'user'>;
  User: Omit<UserType['User']['type'], 'todos'>;
};

/**
 * DynamoPayload defines the allowed payload shapes for
 * each table and action in your DynamoDB Lambda.
 */
export type DynamoPayload =
  // Todo table
  | { table: 'Todo'; action: 'create'; item: TableItemMap['Todo'] }
  | { table: 'Todo'; action: 'get'; key: Pick<TableItemMap['Todo'], 'id'> }
  | {
      table: 'Todo';
      action: 'update';
      key: Pick<TableItemMap['Todo'], 'id'>;
      updateExpression: string;
      values: Partial<TableItemMap['Todo']>;
    }
  | { table: 'Todo'; action: 'delete'; key: Pick<TableItemMap['Todo'], 'id'> }

  // User table
  | { table: 'User'; action: 'create'; item: TableItemMap['User'] }
  | { table: 'User'; action: 'get'; key: Pick<TableItemMap['User'], 'id'> }
  | {
      table: 'User';
      action: 'update';
      key: Pick<TableItemMap['User'], 'id'>;
      updateExpression: string;
      values: Partial<TableItemMap['User']>;
    }
  | { table: 'User'; action: 'delete'; key: Pick<TableItemMap['User'], 'id'> };
