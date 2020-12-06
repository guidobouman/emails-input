type Entry = {
  string: string,
  isValid: Boolean,
  element: HTMLSpanElement
};

class EmailsInput {
  container: HTMLElement;
  inputElement: HTMLInputElement;
  listContainer: HTMLSpanElement;
  entryList: Array<Entry> = [];

  delimiter: string = ',';
  validityRegex: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  placeholderText: string = 'add more people...';
  deleteNode: string | Node = '&times;';

  constructor(container: HTMLElement) {
    if(!container) {
      throw new Error('Did you forget to provide a container?');
    }

    if(container.hasChildNodes()) {
      console.warn('The container does not seem to be empty, are you sure?', container)
    }

    this.container = container;

    this.scaffoldStructure();
    this.bindEventListeners();
  }

  scaffoldStructure() {
    this.listContainer = document.createElement('span');
    this.listContainer.classList.add('entry-list');
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('type', 'text');
    this.inputElement.setAttribute('placeholder', this.placeholderText);
    this.inputElement.classList.add('entry-input');

    this.container.append(this.listContainer, this.inputElement);
  }

  bindEventListeners() {
    this.inputElement.addEventListener('input', this.processInput.bind(this));
    this.inputElement.addEventListener('keydown', this.processKeydown.bind(this));
    this.inputElement.addEventListener('blur', this.processBlur.bind(this));
  }

  processInput(event: InputEvent) {
    const input = this.inputElement.value;

    // Only process input when there's a field delimiter
    if(input.indexOf(this.delimiter) == -1) {
      return;
    }

    // Take care of multiple e-mails pasted at once
    const entries = input.split(this.delimiter);
    entries.forEach(this.addEntry.bind(this));
  }

  processKeydown(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      event.preventDefault();
      this.addEntry();
    }
  }

  processBlur(event: FocusEvent) {
    // TODO: This might be a confusing UX, do we really want this?
    this.addEntry();
  }

  addEntry(entryString: string = this.inputElement.value) {
    const filteredEntryString = entryString.trim();

    if(filteredEntryString.length == 0) {
      return;
    }

    const isValidEntry = this.validityRegex.test(filteredEntryString);
    const element = this.createEntryElement(filteredEntryString, isValidEntry);

    this.listContainer.append(element);
    // The space is used as natural spacer, to mimic input behaviour
    this.listContainer.append(' ');

    // Cleanup input
    this.inputElement.value = '';

    this.entryList.push({
      string: filteredEntryString,
      isValid: isValidEntry,
      element
    });
  }

  deleteEntry(element: Node) {
    this.entryList = this.entryList.filter(entry => entry.element !== element);
    this.listContainer.removeChild(element);
  }

  createEntryElement(content: string, isValid: boolean) {
    const element = document.createElement('span');
    element.textContent = content;
    element.classList.add('entry');
    element.classList.add(isValid ? 'valid' : 'invalid');

    const deleteElement = document.createElement('button');
    if(typeof this.deleteNode === 'string') {
      deleteElement.innerHTML = this.deleteNode;
    }
    else {
      deleteElement.append(this.deleteNode.cloneNode());
    }

    deleteElement.classList.add('entry-delete');
    deleteElement.addEventListener('click', () => {
      this.deleteEntry(element);
    })

    // The space is used as natural spacer, to mimic input behaviour
    element.append(' ');
    element.append(deleteElement);

    return element;
  }
}
