## Todo Backend (AWS Amplify Gen 2)

Serverless backend for a Todo application, built with **AWS Amplify Gen 2** (the `@aws-amplify/backend` package) and **API Gateway + Lambda**.  
It exposes a versioned REST API for managing todos and users and uses Amplify Data for persistence.

### Features

- **Amplify backend**: Defined via `amplify/backend.ts` using `defineBackend`.
- **Data models**: `Todo` and `User` models in `amplify/data/schema.ts`.
- **REST API**: API Gateway `/v0/todos` endpoints wired to Lambda functions.
- **Todo Lambdas**: Handlers for create, get, update, delete todos under `amplify/functions/*-todo`.
- **Storage**: S3 storage for attachments (referenced from `Todo.media`).
- **Auth integration**: Auth resource wired into the backend (via `auth/resource`).

### Project structure

- `amplify/backend.ts` – Main backend definition; wires auth, data, storage, functions, API, and IAM policies.
- `amplify/api/` – API Gateway configuration and route wiring (e.g. `configureTodoRoutes` for `/v0/todos`).
- `amplify/data/schema.ts` – Amplify Data models for `Todo` and `User`.
- `amplify/functions/*` – Lambda handlers and CDK resources for each operation (create, get, update, delete, upload URL).
- `amplify/shared/` – Shared utilities (logging, error handling, response helpers, types).
- `package.json` – Root project scripts and dependencies.

### Data model

**Todo**

- `id`: string
- `userId`: string
- `title`: string (required)
- `content`: string (required)
- `status`: enum `pending | progress | completed`
- `media`: string[] (S3 object identifiers)
- `user`: belongs-to `User`
- `createdAt`, `updatedAt`: datetime

**User**

- `id`: string
- `name`: string (required)
- `email`: email (required)
- `phone`: phone (optional)
- `profileUrl`, `coverUrl`: URL (optional)
- `todos`: has-many relationship to `Todo`
- `createdAt`, `updatedAt`: datetime

### API overview

Base path: **`/v0`**

**Todos**

- `POST /v0/todos` – Create a todo.
- `GET /v0/todos` – List todos.
- `GET /v0/todos/{id}` – Get a single todo.
- `PUT /v0/todos/{id}` – Update a todo.
- `DELETE /v0/todos/{id}` – Delete a todo.

These routes are configured in `amplify/api/todo.ts` and are backed by the corresponding Lambda functions defined under `amplify/functions`.

### Prerequisites

- **Node.js** (LTS recommended).
- **npm** (or another compatible package manager).
- An **AWS account** with credentials configured locally (e.g. via `aws configure`).
- **Amplify Backend CLI** (`@aws-amplify/backend-cli`) installed globally or used via `npx`.

### Setup & local development

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the Amplify sandbox**

   The sandbox spins up your backend in a temporary Amplify environment for local / iterative development.

   ```bash
   npm run sandbox
   ```

   This uses the `ampx sandbox` command defined in `package.json`.  
   When the sandbox is running, Amplify will generate an `amplify_outputs.json` file containing the API URL and other environment metadata.

3. **Find the API URL**

   After the sandbox starts, open `amplify_outputs.json` and look for:
   - `custom.api_url`
   - `custom.api_name`

   Use `custom.api_url` as the base URL when calling your API.

4. **Test the API**

   Example (using `curl` and assuming `custom.api_url` is `https://example.execute-api.region.amazonaws.com/`):

   ```bash
   curl -X POST "$API_URL/v0/todos" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "My first todo",
       "content": "Write better docs"
     }'
   ```

   Replace `$API_URL` with the actual value from `amplify_outputs.json`.

### Formatting / tooling

- **Format code**

  ```bash
  npm run format
  ```

### Deployment (high level)

This project is set up with Amplify Gen 2. To deploy:

- Use the **Amplify Backend CLI** (`ampx`) to provision and update backend resources in your AWS account.
- Follow the official Amplify Gen 2 backend docs for connecting this repository to Amplify, configuring environments, and running deployments.

Refer to the official Amplify documentation for the latest deployment workflows:  
`https://docs.amplify.aws/react/build-a-backend/`
