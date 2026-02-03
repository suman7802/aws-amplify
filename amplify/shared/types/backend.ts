import { Backend } from '@aws-amplify/backend';

import { auth } from '../../auth/resource';
import { data } from '../../data/resource';
import { generateUploadUrl } from '../../functions/generate-upload-url/resource';
import { storage } from '../../storage/resource';
import { createTodo } from '../../functions/create-todo/resource';
import { updateTodo } from '../../functions/update-todo/resource';
import { deleteTodo } from '../../functions/delete-todo/resource';
import { getTodo } from '../../functions/get-todo/resource';

export const schema = {
  auth,
  data,
  storage,
  generateUploadUrl,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
};

export type AppBackend = Backend<typeof schema>;
