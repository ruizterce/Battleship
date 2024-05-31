import { greet } from './index';

test('greet function should return "Hello, Webpack!"', () => {
  expect(greet()).toBe('Hello, Webpack!');
});
