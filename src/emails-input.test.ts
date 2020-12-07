import { expect } from '@jest/globals';

//@ts-ignore
import { EmailsInput } from '../dist/emails-input';

describe('class constructor', () => {
  test('should be able to instantiate', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    expect(instance).toBeInstanceOf(EmailsInput);
    expect(container.hasChildNodes()).toBe(true);
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

  test('should be able to instantiate with custom config', () => {
    const container = document.createElement('div');
    const config = {
      placeholderText: 'custom placeholder text',
      insertWhitespace: false
    }
    const instance = new EmailsInput(container, config);

    expect(instance).toBeInstanceOf(EmailsInput);

    expect(instance.config.insertWhitespace).toBe(false);
    expect(instance.inputElement.placeholder).toBe('custom placeholder text');
  });
});

describe('input field', () => {
  test('should add entry on comma', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const input = instance.inputElement;
    const exampleMail = 'test@example.com';

    expect(instance.getEntries().length).toBe(0);

    input.value = exampleMail;
    input.dispatchEvent(new InputEvent('input'));

    expect(input.value).toBe(exampleMail);
    expect(instance.entryList.length).toBe(0);

    input.value = exampleMail + ',';
    input.dispatchEvent(new InputEvent('input'));

    expect(input.value).toBe('');
    expect(instance.entryList.length).toBe(1);

    input.value = 'invalid,';
    input.dispatchEvent(new InputEvent('input'));

    expect(input.value).toBe('');
    expect(instance.entryList.length).toBe(2);
  });

  test('should split multiple entries', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const input = instance.inputElement;

    expect(instance.entryList.length).toBe(0);

    input.value = 'one, two, three';
    input.dispatchEvent(new InputEvent('input'));

    expect(input.value).toBe('');
    expect(instance.entryList.length).toBe(3);
  });

  test('should add entry on enter', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const input = instance.inputElement;

    expect(instance.getEntries().length).toBe(0);

    input.value = 'test@example.com';
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter'
    }));

    expect(input.value).toBe('');
    expect(instance.entryList.length).toBe(1);
  });

  test('should add entry on blur', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const input = instance.inputElement;

    expect(instance.getEntries().length).toBe(0);

    input.value = 'test@example.com';
    input.dispatchEvent(new FocusEvent('blur'));

    expect(input.value).toBe('');
    expect(instance.entryList.length).toBe(1);
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

    expect(entry.element.classList.contains('valid')).toBe(true);
    expect(entry.element.classList.contains('invalid')).toBe(false);

    const entryTwo = instance.addEntry('this-is@valid');
    expect(entryTwo.isValid).toBe(true);
  });

  test('should mark invalid entries', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('invalid.email');
    expect(entry.isValid).toBe(false);

    expect(entry.element.classList.contains('valid')).toBe(false);
    expect(entry.element.classList.contains('invalid')).toBe(true);

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

describe('getEntries', () => {
  test('should return the right amount of entries', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    expect(instance.getEntries()).toBeInstanceOf(Array);
    expect(instance.getEntries().length).toBe(0);

    instance.addEntry('test@example.com');

    expect(instance.getEntries().length).toBe(1);

    instance.addEntry('test@example.com');

    expect(instance.getEntries().length).toBe(2);

    instance.addEntry('test@example.com');

    expect(instance.getEntries().length).toBe(3);
  });

  test('should return invalid entries when requested', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    expect(instance.getEntries().length).toBe(0);

    instance.addEntry('invalid.email');

    expect(instance.getEntries().length).toBe(0);
    expect(instance.getEntries(true).length).toBe(1);
  });
});

describe('deleteEntry', () => {
  test('should remove entry', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('test@example.com');

    expect(instance.getEntries().length).toBe(1);

    const result = instance.deleteEntry(entry.element);
    expect(result).toBe(true);

    expect(instance.getEntries().length).toBe(0);
  });

  test('should abort on invalid parameters', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const result = instance.deleteEntry();
    expect(result).toBe(false);

    const element = document.createElement('div');
    const resultWithElement = instance.deleteEntry(element);
    expect(resultWithElement).toBe(false);
  });
});

describe('output field', () => {
  test('should populate on addEntry', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    instance.addEntry('test@example.com');
    expect(instance.outputElement.value).toBe('test@example.com');

    instance.addEntry('test@example.com');
    expect(instance.outputElement.value).toBe('test@example.com,test@example.com');
  });

  test('should populate on deleteEntry', () => {
    const container = document.createElement('div');
    const instance = new EmailsInput(container);

    const entry = instance.addEntry('test@example.com');
    instance.addEntry('test@example.com');
    expect(instance.outputElement.value).toBe('test@example.com,test@example.com');

    instance.deleteEntry(entry.element);
    expect(instance.outputElement.value).toBe('test@example.com');
  });
});
