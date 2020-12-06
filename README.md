# Emails Input
A styleable, helpful e-mail input.

## Installation

When included, the script mounts a class-like function on the global scope, under the name `EmailsInput`. In the most basic setup, Emails Input expects a container element where it can render.

```html
<div id="emails-input"></div>

<script src="emails-input.js"></script>
<script>
  var inputContainerNode = document.querySelector('#emails-input');
  var emailsInput = new EmailsInput(inputContainerNode);
</script>
```

## API

Emails Input has a couple of public methods to interact with the library. These become available on the instance that is returned when the library has been instantiated through the `new EmailsInput(...);` syntax.

### addEntry

```ts
function addEntry(entryString: string = this.inputElement.value): HTMLElement
```

Manually add an entry. It takes the current input element value by default. Can be overridden to add a custom entry. Retruns the element that holds the entry. This element is the reference used by the `deleteEntry` method.

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

The type for each entry is the following:

```ts
type Entry = {
  string: string,
  isValid: Boolean,
  element: HTMLSpanElement
};
```

- `string`: is the string representation of the entry;
- `isValid`: the state wheter or not the entry is valid, according to the RegEx;
- `element`: reference to the element that holds the entry, used in `deleteEntry`.

## Contribution

Start the watcher through npm or yarn.
```sh
npm start
```

Open index.html in your favorite browser, and start developing.