import { expect } from '@jest/globals';

import { EmailsInput } from '../dist/emails-input';

test('should be able to instantiate', () => {
  const container = document.createElement('div');
  const instance = new EmailsInput(container);

  expect(instance).toBeInstanceOf(EmailsInput);
});

test('should break on missing container', () => {
  expect(() => {
    new EmailsInput();
  }).toThrowError("Did you forget to provide a container?");
});