# webpack-frontend-template

Front-end pre configured template repository to quickly start developing projects using webpack, ESLint, Prettier, Babel and Jest.

## Installation

Clone this repository and run

```bash
  npm install
```

## Configuration in VSCode

Install the following extensions:

ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

Prettier:
https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

Add the following rules to VSCode settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": ["source.fixAll.eslint"],
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "vue"],
  "eslint.experimental.useFlatConfig": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
