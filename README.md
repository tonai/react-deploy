# Misc

## .npmrc

Create file `.npmrc` with:

```
save-exact=true
```

Remove all `^`, `*`, `~` in file `package.json` (you can get current installed version with `npm list --depth=0`).

# Code style

## .editorconfig

Create file `.editorconfig` with:

```
# Editor configuration, see http://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
max_line_length = off
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
indent_size = 4
```

## prettier

```bash
npm install --D prettier
```

Create file `.prettierignore` with:

```
/node_modules/**
/build/**
```

Create file `.prettierrc.json` with:

```
{
  "singleQuote": true,
  "trailingComma": "none",
  "useTabs": false,
  "printWidth": 120,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

Add script in file `package.json` with:

```json
"scripts": {
  "prettier": "prettier --write ."
}
```

Run with `npm run prettier` (or `npx prettier --write .`).

Integrate in IDE: https://prettier.io/docs/en/editors.html

# Quality checks

## eslint

Already installed with `create-react-app`.

To be able to execute it independently you have to add `typescript` in the project dependencies:

```bash
npm i -D typescript
```

To be compatible with `prettier` you must install :

```bash
npm i -D eslint-config-prettier
```

Update file `package.json` with (or create `.eslintrc.json` file):

```json
"eslintConfig": {
  "extends": [
    "react-app",
    "plugin:cypress/recommended",
    "prettier",
    "prettier/react"
  ]
}
```

Create file `.eslintignore` with:

```
/node_modules/**
/build/**
```

Add script in file `package.json` with:

```json
"scripts": {
  "eslint": "eslint --max-warnings=0 --fix './**/*.{js,jsx,ts,tsx}'"
}
```

Run with `npm run eslint`.

## Stylelint

```
npm i -D stylelint stylelint-config-standard stylelint-config-prettier
```

Create file `.stylelintignore` with:

```
/node_modules/**
/build/**
```

Create file `.stylelintrc.json` with:

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-prettier"]
}
```

# Compatibility

## CSS reset

Update file `src/assets/css/main.css` with:

```css
@import-normalize;

body {
  margin: 0;
}
```

## Polyfills (IE11)

Start IE11 using VirtualBox (https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/).

Check your IP with `ifconfig` and open the app using your local IP (exemple: http://172.19.0.1:3000/).

```bash
npm install --D react-app-polyfill
```

Update file `package.json` with:

```json
"browserslist": [
  ">0.2%",
  "not dead",
  "not ie <= 11",
  "not op_mini all",
  "IE 11"
]
```

Create file `src/polyfills.js` with:

```js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```

Update file `src/index.js` with:

```js
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';

import './assets/css/main.css';

ReactDOM.render(<App />, document.getElementById('root'));
```

Delete the `node_modules/.cache` directory (or reinstall packages).

# Automatisation

## Husky

```bash
npm i -D husky
```

Update file `package.json` with:

```json
"husky": {
  "hooks": {
    "post-checkout": "./scripts/post-checkout.sh $HUSKY_GIT_PARAMS",
    "post-merge": "npm ci",
    "post-rebase": "npm i"
  }
},
```

Create file `scripts/post-checkout.sh` with:

```bash
#!/bin/bash

sha1=$1
sha2=$2
flag=$3

check_updated() {
  updated=`git diff --name-status $sha1 $sha2 | grep package-lock.json | wc -l`
}

check_updated
if [[ $flag == "1" && $updated == "1" ]]
then
  npm ci
fi
```

## lint-staged

```bash
npm i -D lint-staged
```

Update file `package.json` with:

```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged",
  }
},
```

And :

```json
"lint-staged": {
  "./**/*.{js,jsx,ts,tsx}": [
    "eslint --max-warnings=0 --fix",
    "git add",
    "prettier --write",
    "git add",
    "react-scripts test --bail --findRelatedTests"
  ],
  "./**/*.{css,scss,sass}": [
    "stylelint --fix",
    "git add",
    "prettier --write",
    "git add"
  ],
  "./**/*.{json,md,html}": [
    "prettier --write",
    "git add"
  ]
},
```

## Commitlint

```bash
npm i -D commitlint
```

Update file `package.json` with:

```json
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  }
},
```

Create file `.commitlintrc.js` with:

```js
module.exports = {
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 500],
    'scope-case': [2, 'always', 'camel-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // Feature
        'fix', // Bugfix
        'impr', // Improvement
        'docs', // Documentation
        'chore', // Build, config...
        'tests', // Unit tests
        'refactor' // Refactoring
      ]
    ]
  }
};
```
