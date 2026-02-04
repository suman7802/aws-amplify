import { type ClientSchema, a } from '@aws-amplify/backend';

export const todoSchema = a.schema({
  Todo: a
    .model({
      id: a.id(),
      userId: a.id().required(),
      title: a.string().required(),
      content: a.string().required(),
      status: a.enum(['pending', 'progress', 'completed']),
      media: a.string().array(), // array of S3 IDs
      user: a.belongsTo('User', 'userId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),
});
export type TodoType = ClientSchema<typeof todoSchema>;

export const userSchema = a.schema({
  User: a
    .model({
      id: a.id(),
      name: a.string().required(),
      email: a.email().required(),
      phone: a.phone(),
      profileUrl: a.url(),
      coverUrl: a.url(),
      todos: a.hasMany('Todo', 'userId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),
});
export type UserType = ClientSchema<typeof userSchema>;

export const testSchema = a.schema({
  Test: a
    .model({
      id: a.id(),
      name: a.string().required(),
      email: a.email().required(),
      phone: a.phone(),
      profileUrl: a.url(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest()]),
});
export type TestType = ClientSchema<typeof testSchema>;

export const schema = a.combine([todoSchema, userSchema, testSchema]);
export type SchemaType = ClientSchema<typeof schema>;
