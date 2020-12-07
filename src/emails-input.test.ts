import { expect } from '@jest/globals';

import { EmailsInput } from '../dist/emails-input';

describe('class constructor', () => {
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

  test('should warn on non-empty container', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});

    const container = document.createElement('div');
    container.textContent = "not empty";

    expect(spy).not.toHaveBeenCalled();
    new EmailsInput(container);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
});

describe('addEntry', () => {
  test('should be able to add entry', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('test@example.com');
    expect(entry.string).toBe('test@example.com');
  });

  test('should mark valid entries', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('test@example.com');
    expect(entry.isValid).toBe(true);

    const entryTwo = instance.addEntry('this-is@valid');
    expect(entryTwo.isValid).toBe(true);
  });

  test('should mark invalid entries', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('invalid.email');
    expect(entry.isValid).toBe(false);

    const entryTwo = instance.addEntry('@invalid.email');
    expect(entryTwo.isValid).toBe(false);

    const entryThree = instance.addEntry('this-is@invalid.');
    expect(entryThree.isValid).toBe(false);
  });

  test('should strip whitespace', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('  test@example.com  ');
    expect(entry.string).toBe('test@example.com');
  });
});
