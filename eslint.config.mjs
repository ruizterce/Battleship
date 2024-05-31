import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import babelParser from '@babel/eslint-parser';
import htmlPlugin from 'eslint-plugin-html';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-env']
        }
      }
    },
    env: {
      browser: true,
      node: true,
      'jest/globals': true
    }
  },
  {
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    ignores: [
      'node_modules/*',
      'dist/*',
      'package.json',
      'package-lock.json',
      'webpack.common.js',
      'webpack.dev.js',
      'webpack.prod.js'
    ]
  },
  pluginJs.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: pluginPrettier,
      html: htmlPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['**/*.html'],
    processor: 'html/html-processor'
  }
];
