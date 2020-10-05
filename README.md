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
- Resource name: `articles`
- Lambda name: `articles`
- Runtime: `NodeJS`
- Template: `CRUD function for DynamoDB`
- DynamoDB source option: `Create a new DynamoDB table`
- DynamoDB:
  - Resource name: `apireactdeploy`
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
- Resource name: `categories`
- Lambda name: `categories`
- Runtime: `NodeJS`
- Template: `CRUD function for DynamoDB`
- DynamoDB source option: `Create a new DynamoDB table`
- DynamoDB:
  - Resource name: `apireactdeploy`
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
- Select operations: `read`
- Recurring schedule: `n`
- Lambda layers: `n`
- Edit now: `n`
- Restrict API access: `n`
