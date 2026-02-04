import { TodoType, UserType } from '../../data/schema';

export type TableItemMap = {
  Todo: Omit<TodoType['Todo']['type'], 'user'>;
  User: Omit<UserType['User']['type'], 'todos'>;
};

export type DynamoPayload =
  // Todo table
  | { table: 'Todo'; action: 'create'; item: TableItemMap['Todo'] }
  | { table: 'Todo'; action: 'get'; key: Partial<TableItemMap['Todo']> }
  | { table: 'Todo'; action: 'update'; key: Partial<TableItemMap['Todo']>; updateExpression: string; values: Partial<TableItemMap['Todo']> }
  | { table: 'Todo'; action: 'patch'; key: Partial<TableItemMap['Todo']>; updateExpression: string; values: Partial<TableItemMap['Todo']> }
  | { table: 'Todo'; action: 'delete'; key: Partial<TableItemMap['Todo']> }

  // User table
  | { table: 'User'; action: 'create'; item: TableItemMap['User'] }
  | { table: 'User'; action: 'get'; key: Partial<TableItemMap['User']> }
  | { table: 'User'; action: 'update'; key: Partial<TableItemMap['User']>; updateExpression: string; values: Partial<TableItemMap['User']> }
  | { table: 'User'; action: 'patch'; key: Partial<TableItemMap['User']>; updateExpression: string; values: Partial<TableItemMap['User']> }
  | { table: 'User'; action: 'delete'; key: Partial<TableItemMap['User']> };
