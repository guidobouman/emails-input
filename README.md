# Emails Input
A styleable, helpful e-mail input.

## Installation

When included, the script mounts a class-like function on the global scope, under the name `EmailsInput`. In the most basic setup, `EmailsInput` expects a container element where it can render. It returns an instance of `EmailsInput` that is bound to the provided container.

```html
<div id="emails-input"></div>

<script src="emails-input.js"></script>
<script>
  var inputContainerNode = document.querySelector('#emails-input');
  var emailsInput = new EmailsInput(inputContainerNode);
</script>
```

The entered (valid) emails wil be rendered as a comma-separated list in a hidden input element. See the config section to control the field name.

## Style

The list of classes below is added to the rendered elements, so the user can make Emails Input fit into any app or project.

- `entry-list`: The top level list containing the list of entries and the input field;
- `entry`: A separate entry, it contains the entry as text and a delete button;
  - `valid`: Added to the entry when it is deemed valid by the RegEx;
  - `invalid`: Added to the entry when it is deemed invalid by the RegEx;
- `entry-delete`: The button element that processes the entry delete action;
- `entry-input`: The input field that is used to add entries.

## Config

`EmailsInput` accepts an options object with the type `Partial<ConfigOptions>` as its second parmeter.

The definition for the ConfigOptions type:
```ts
type ConfigOptions = {
  inputName: string // name of the form input field that will carry the entered e-mails
  delimiter: string, // delimiter between email inputs
  validityRegex: RegExp, // RegExp to check if an email is valid
  placeholderText: string, // text present in the emails input field
  deleteNode: string | Node, // node used in the delete button for each entry
  insertWhitespace: boolean // insert whitespace to comply with default input style
};
```

Its defaults are:
```ts
var defaultConfig: ConfigOptions = {
  inputName: 'emails',
  delimiter: ',',
  validityRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  placeholderText: 'add more people...',
  deleteNode: '&times;',
  insertWhitespace:  true
}
```

Usage:
```js
var customConfig = { ... };
var emailsInput = new EmailsInput(inputContainerNode, customConfig);
```

## API

Emails Input has a couple of public methods to interact with the library. These become available on the instance that is returned when the library has been instantiated through the `new EmailsInput(...);` syntax.

### addEntry

```ts
function addEntry(entryString: string = this.inputElement.value): Entry
```

Manually add an entry. It takes the current input element value by default. Can be overridden to add a custom entry. Retruns an Entry object.

Definition of the Entry type:
```ts
type Entry = {
  string: string,
  isValid: Boolean,
  element: HTMLSpanElement
};
```

Description of each Entry property:
- `string`: the sanitized string representation of the entry
- `isValid`: the state wheter or not the entry is valid, according to the RegEx;
- `element`: reference to the DOM element that holds the entry, used by `deleteEntry`.

### deleteEntry

```ts
function deleteEntry(element: Node): boolean
```

Manually delete an entry. It takes the active element that holds the entry, provided by `addEntry`. It returns a boolean, indicating wheter or not the operation was successful.

### getEntries

```ts
function getEntries(includeInvalidEntries: boolean = false): Entry[]
```

Get a list of all entries currently present. Accepts a boolean to also include the invalid entries in the returned result. Returns an array with entries, which can be zero-length.

## Contribution

The TypeScript watcher is available under the `start` stript.
```sh
npm start
```

Open index.html in your favorite browser, and start developing.