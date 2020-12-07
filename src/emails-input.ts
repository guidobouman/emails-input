type Entry = {
  string: string,
  isValid: Boolean,
  element: HTMLSpanElement
};

type ConfigOptions = {
  inputName: string,
  delimiter: string,
  validityRegex: RegExp,
  placeholderText: string,
  deleteNode: string | Node,
  insertWhitespace: boolean
};

class EmailsInput {
  private container: HTMLElement;
  private inputElement: HTMLInputElement;
  private listContainer: HTMLSpanElement;
  private entryList: Entry[] = [];
  private outputElement: HTMLInputElement;

  private config: ConfigOptions;

  constructor(container: HTMLElement, options: Partial<ConfigOptions> = {}) {
    if(!container) {
      throw new Error('Did you forget to provide a container?');
    }

    if(container.hasChildNodes()) {
      console.warn('The container does not seem to be empty, are you sure?', container)
    }

    this.container = container;

    this.config = {
      inputName: 'emails',
      delimiter: ',',
      validityRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      placeholderText: 'add more people...',
      deleteNode: '&times;',
      insertWhitespace:  true,
      ...options
    };

    this.scaffoldStructure();
    this.bindEventListeners();
  }

  private scaffoldStructure() {
    this.listContainer = document.createElement('span');
    this.listContainer.classList.add('entry-list');
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('type', 'text');
    this.inputElement.setAttribute('placeholder', this.config.placeholderText);
    this.inputElement.classList.add('entry-input');

    this.outputElement = document.createElement('input');
    this.outputElement.setAttribute('type', 'hidden');
    this.outputElement.setAttribute('name', this.config.inputName);

    this.listContainer.appendChild(this.inputElement);
    this.container.appendChild(this.listContainer);
    this.container.appendChild(this.outputElement);
  }

  private bindEventListeners() {
    this.inputElement.addEventListener('input', this.processInput.bind(this));
    this.inputElement.addEventListener('keydown', this.processKeydown.bind(this));
    this.inputElement.addEventListener('blur', this.processBlur.bind(this));
  }

  private processInput(event: InputEvent) {
    const input = this.inputElement.value;

    // Only process input when there's a field delimiter
    if(input.indexOf(this.config.delimiter) == -1) {
      return;
    }

    // Take care of multiple e-mails pasted at once
    const entries = input.split(this.config.delimiter);
    entries.forEach(this.addEntry.bind(this));

    this.inputElement.value = '';
  }

  private processKeydown(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      event.preventDefault();
      this.addEntry();
      this.inputElement.value = '';
    }
  }

  private processBlur(event: FocusEvent) {
    // TODO: This might be a confusing UX, do we really want this?
    this.addEntry();
    this.inputElement.value = '';
  }

  public addEntry(entryString: string = this.inputElement.value): Entry {
    const filteredEntryString = entryString.trim();

    if(filteredEntryString.length == 0) {
      return;
    }

    const isValidEntry = this.config.validityRegex.test(filteredEntryString);
    const element = this.createEntryElement(filteredEntryString, isValidEntry);

    this.listContainer.insertBefore(element, this.inputElement);

    if(this.config.insertWhitespace) {
      // The space is used as natural spacer, to mimic inline input behaviour
      this.inputElement.insertAdjacentText('beforebegin', ' ');
    }

    const entry = {
      string: filteredEntryString,
      isValid: isValidEntry,
      element
    }
    this.entryList.push(entry);

    this.updateOutput();

    return entry;
  }

  public deleteEntry(element: Node): boolean {
    if(!this.listContainer.contains(element)) {
      return false;
    }

    this.entryList = this.entryList.filter(entry => entry.element !== element);
    this.listContainer.removeChild(element);

    this.updateOutput();

    return true;
  }

  public getEntries(includeInvalidEntries: boolean = false): Entry[] {
    return this.entryList.filter(entry => includeInvalidEntries || entry.isValid);
  }

  private createEntryElement(content: string, isValid: boolean) {
    const element = document.createElement('span');
    element.textContent = content;
    element.classList.add('entry');
    element.classList.add(isValid ? 'valid' : 'invalid');

    const deleteElement = document.createElement('button');
    if(typeof this.config.deleteNode === 'string') {
      deleteElement.innerHTML = this.config.deleteNode;
    }
    else {
      deleteElement.appendChild(this.config.deleteNode.cloneNode(true));
    }

    deleteElement.classList.add('entry-delete');
    deleteElement.addEventListener('click', () => {
      this.deleteEntry(element);
    });

    element.appendChild(deleteElement);

    if (this.config.insertWhitespace) {
      // The space is used as natural spacer, to mimic inline input behaviour
      deleteElement.insertAdjacentText('beforebegin', ' ');
    }

    return element;
  }

  private updateOutput() {
    const outputString = this.getEntries().reduce((accumulator, entry) => {
      return accumulator.length > 0 ? accumulator + ',' + entry.string : entry.string;
    }, '');

    this.outputElement.value = outputString;
  }
}

// Manually export to support testing through import
if(typeof exports === "object") {
  exports.EmailsInput = EmailsInput;
}