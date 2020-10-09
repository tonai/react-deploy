# Building

[![tonai](https://circleci.com/gh/tonai/react-deploy.svg?style=svg)](https://circleci.com/gh/tonai/react-deploy)

## Generate bundle

Run command:

```bash
npm run build
```

## Test bundle

```bash
npm i -g serve
```

Run command:

```bash
serve -s build
```

But we have a problem with fetching the API (because we don't have the proxy anymore).

Create file `.env.development` with:

```
REACT_APP_API_URL = ''
```

Create file `.env.production` with:

```
REACT_APP_API_URL = 'http://localhost:3001'
```

Create file `.env.test` with:

```
REACT_APP_API_URL = ''
```

Create file `src/services/apiService/apiService.js` with:

```js
export const baseUrl = (() => {
  const url = process.env.REACT_APP_API_URL;
  if (url.lastIndexOf('/') === url.length - 1) {
    return url.slice(0, -1);
  }
  return url;
})();

export default function api(url, options) {
  if (url.indexOf('/') === 0) {
    url = url.slice(1);
  }
  return fetch(`${baseUrl}/${url}`, options);
}
```

Replace `fetch` calls with this new `api` function and try again.

## Analysing bundle

```bash
npm i -D source-map-explorer
```

Update file `package.json` with:

```json
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'"
},
```

Run command:

```bash
npm run analyze
```

# Deploy

## GH pages

```
npm i -D gh-pages
```

Update file `package.json` with:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
},
```

Run command:

```bash
npm run deploy
```

Check the settings of your project in Github and search for `GitHub Pages` to get the URL your app (exemple: https://tonai.github.io/react-deploy/).

Check your site, but files should not load correclty.

Update file `package.json` with:

```json
"homepage": "https://tonai.github.io/react-deploy/"
```

Run command again:

```bash
npm run deploy
```

And check again.

## AWS Amplify

### Initialization

https://docs.amplify.aws/start/getting-started/installation/q/integration/react

```bash
npm i -g @aws-amplify/cli
```

Run command:

```bash
amplify configure
```

Steps :

- Select region: `eu-west-1`
- User name: `amplify-react-deploy`
- Create user on web interface (next/next/next)
- Enter access key
- Enter secret key
- Profile name: `react-deploy`

### Setup backend

Run command:

```bash
amplify init
```

Steps :

- Project name: `reactdeploy`
- Environment: `dev`
- Default editor: `Visual Studio Code`
- App type: `javascript`
- Javascript framework: `react`
- Source path: `src`
- Distribution path: `build`
- Build command: `npm run-script build`
- Start command: `npm run-script start`
- use AWS profile: `y`
- Profile: `react-deploy`

### Create API

Run command:

```bash
amplify add api
```

Steps:

- Service: `REST`
- Resource name: `apireactdeploy`
- Path: `/articles`
- Lambda source: `Create a new Lambda function`
- Resource name: `apiarticles`
- Lambda name: `articles`
- Runtime: `NodeJS`
- Template: `CRUD function for DynamoDB`
- DynamoDB source option: `Create a new DynamoDB table`
- DynamoDB:
  - Resource name: `dynamoarticles`
  - Table name: `articles`
  - Columns:
    - Column: `id`
    - Type: `number`
    - Add another column: `y`
    - Column: `title`
    - Type: `string`
    - Add another column: `y`
    - Column: `content`
    - Type: `string`
    - Add another column: `y`
    - Column: `category`
    - Type: `number`
    - Add another column: `y`
    - Column: `published`
    - Type: `boolean`
    - Add another column: `n`
  - Partition key: `id`
  - Sort key: `n`
  - Global secondary indexed: `n`
  - Lambda trigger: `n`
- Create another resources: `y`
- Category: `storage`
- Select operations: `create`, `read`, `update`, `delete`
- Recurring schedule: `n`
- Lambda layers: `n`
- Edit now: `n`
- Restrict API access: `n`
- Add another path: `y`
- Path: `/categories`
- Lambda source: `Create a new Lambda function`
- Resource name: `apicategories`
- Lambda name: `categories`
- Runtime: `NodeJS`
- Template: `CRUD function for DynamoDB`
- DynamoDB source option: `Create a new DynamoDB table`
- DynamoDB:
  - Resource name: `dynamocategories`
  - Table name: `categories`
  - Columns:
    - Column: `id`
    - Type: `number`
    - Add another column: `y`
    - Column: `title`
    - Type: `string`
    - Add another column: `n`
  - Partition key: `id`
  - Sort key: `n`
  - Global secondary indexed: `n`
  - Lambda trigger: `n`
- Create another resources: `y`
- Category: `storage`
- Resource: `dynamocategories`
- Select operations: `read`
- Recurring schedule: `n`
- Lambda layers: `n`
- Edit now: `n`
- Restrict API access: `n`
- Add another path: `n`

### Deploy API

Run command:

```bash
amplify push
```

It will upload files and create a backend endpoint (exemple: `https://x15ez5s0bl.execute-api.eu-west-1.amazonaws.com/dev`)

Service will be created, you can check the status with:

```bash
amplify console
```

### Add categories in database

Steps:

- Connect to AWS console
- Search for `DynamoDB`
- Click `Tables` in the left pane
- Select table `categories-dev`
- In the right pane click `Éléments`
- Click `Créer un élément`
  - Create element `{ "id": 1, "title": "News" }`
  - Create element `{ "id": 2, "title": "Blog post" }`

### Update lambda functions

Update file `amplify/backend/function/apiarticles/src/app.js` with the content this [file](./amplify/backend/function/apiarticles/src/app.js).

Update file `amplify/backend/function/apicategories/src/app.js` with the content this [file](./amplify/backend/function/apicategories/src/app.js).

Deploy again with:

```bash
amplify push
```

Methods `POST`, `PUT` and `DELETE` need rework.

### Update frontend

Install frontend dependencies:

```bash
npm i aws-amplify @aws-amplify/ui-react
```

Create file `src/amplify.js`:

```js
import Amplify from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);
```

Update file `src/index.js` with :

```js
import './amplify';
```

Update file `src/services/apiService/apiService.js` with:

```js
import { API } from 'aws-amplify';

const apiName = process.env.REACT_APP_API_NAME;

export default function api(url, options = {}) {
  if (url.indexOf('/') !== 0) {
    url = '/' + url;
  }

  const { method, ...init } = options;
  switch (method) {
    case 'DELETE':
      return API.delete(apiName, url, init);

    case 'POST':
      return API.post(apiName, url, init);

    case 'PUT':
      return API.put(apiName, url, init);

    default:
      return API.get(apiName, url, init);
  }
}
```

Update `addArticle` and `updateArticle` methods in file `src/services/articleService/articleService.js` with:

```js
addArticle(article) {
  return api('/articles', {
    article = { ...article, id: Date.now() }; // DynamoDB does not have auto increments
    body: article, // JSON.stringify is not needed anymore
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  }).then(() => article); // Return created article
}

updateArticle(article) {
  return api(`/articles/${article.id}`, {
    body: article, // JSON.stringify is not needed anymore
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT'
  });
}
```

Update all `.env*` files with:

```
REACT_APP_API_NAME = 'apireactdeploy'
```

### Deploy Frontend

Run command:

```bash
amplify add hosting
```

Steps:

- Plugin: `Amazon CloudFront and S3`
- Environment setup: `DEV`
- Bucket name: `react-deploy`
- Index: `index.html`
- Error: `index.html`

```bash
amplify publish
```

It will upload files and create a frontend endpoint (exemple: `http://react-deploy-dev.s3-website-eu-west-1.amazonaws.com/`)

Update file `package.json` with:

```json
"homepage": "http://react-deploy-dev.s3-website-eu-west-1.amazonaws.com/"
```

Run command again:

```bash
amplify publish
```

And check again.

# Continuous Integration

## Circle CI

### Configuration

Steps

- Connect to https://app.circleci.com/ with your Github account
- Choose repo and click `Set Up Project`
- Click `Add Config`
  - if it does not work, choose `Manual Setup`
  - Create file `.circleci/config.yml` with:
  ```yml
  version: 2.1
  orbs:
    node: circleci/node@3.0.0
  workflows:
    node-tests:
      jobs:
        - node/test
  ```
  - Commit and push to Gihub
  - Back to Circle CI Click `Start Building`
- Click `Proceed to New UX`

Snapshots must be commited along your code so check the `.gitignore` file ad remove `__snapshots__` if it is present.

Anytime you push to Github, Circle CI will run all your tests.  
You will receive an email if tests failed.  
You cans see the status of your tests in Circle CI Pipelines page : https://app.circleci.com/pipelines/github/tonai/react-deploy

![Circle CI pipelines](./README/circleci.png)

### Badge

https://circleci.com/docs/2.0/status-badges/

You can add in your README file a badge indicating the status of your last pipeline.

Update file `README.md` the with :

```markdown
[![<ORG_NAME>](https://circleci.com/<VCS>/<ORG_NAME>/<PROJECT_NAME>.svg?style=svg)](LINK)
```
