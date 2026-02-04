import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { generateUploadUrl } from './functions/generate-upload-url/resource';
import { setupApiGateway } from './api';
import { createTodo } from './functions/create-todo/resource';
import { getTodo } from './functions/get-todo/resource';
import { updateTodo } from './functions/update-todo/resource';
import { deleteTodo } from './functions/delete-todo/resource';
import { wiring } from './config/wiring';
import { IAMPolicies } from './iam/policies';
import { databaseOperation } from './functions/database-operation/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
  storage,
  auth,
  data,
  databaseOperation,
  generateUploadUrl,
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
});

wiring(backend);
setupApiGateway(backend);
IAMPolicies(backend);
