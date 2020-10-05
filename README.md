# Building

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
- Select table `articles-dev`
- In the right pane click `Éléments`
- Click `Créer un élément`
  - Create element `{ "id": 1, "title": "Article 1", "category": 1, "published": true, "content": "Lorem ipsum" }`
  - Create element `{ "id": 2, "title": "Article 2", "category": 2, "published": true, "content": "Lorem ipsum" }`
  - Create element `{ "id": 3, "title": "Article 3", "category": 1, "published": false, "content": "Lorem ipsum" }`

### Update lambda functions

In file `amplify/backend/function/apiarticles/src/app.js`:

- line 93 change `res.json(data.Items);` into `res.json(data.Items[0]);`
- add method:

```js
app.get(path, function (req, res) {
  let queryParams = {
    TableName: tableName
  };

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: 'Could not load items: ' + err });
    } else {
      res.json(data.Items);
    }
  });
});
```

Same for file `amplify/backend/function/apicategories/src/app.js`.

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
