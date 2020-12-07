type Entry = {
  string: string,
  isValid: Boolean,
  element: HTMLSpanElement
};

class EmailsInput {
  private container: HTMLElement;
  private inputElement: HTMLInputElement;
  private listContainer: HTMLSpanElement;
  private entryList: Entry[] = [];

  private delimiter: string = ',';
  private validityRegex: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  private placeholderText: string = 'add more people...';
  private deleteNode: string | Node = '&times;';
  private insertWhitespace: boolean = true;

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

  private scaffoldStructure() {
    this.listContainer = document.createElement('span');
    this.listContainer.classList.add('entry-list');
    this.inputElement = document.createElement('input');
    this.inputElement.setAttribute('type', 'text');
    this.inputElement.setAttribute('placeholder', this.placeholderText);
    this.inputElement.classList.add('entry-input');

    this.listContainer.appendChild(this.inputElement);
    this.container.appendChild(this.listContainer);
  }

  private bindEventListeners() {
    this.inputElement.addEventListener('input', this.processInput.bind(this));
    this.inputElement.addEventListener('keydown', this.processKeydown.bind(this));
    this.inputElement.addEventListener('blur', this.processBlur.bind(this));
  }

  private processInput(event: InputEvent) {
    const input = this.inputElement.value;

    // Only process input when there's a field delimiter
    if(input.indexOf(this.delimiter) == -1) {
      return;
    }

    // Take care of multiple e-mails pasted at once
    const entries = input.split(this.delimiter);
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

    const isValidEntry = this.validityRegex.test(filteredEntryString);
    const element = this.createEntryElement(filteredEntryString, isValidEntry);

    this.listContainer.insertBefore(element, this.inputElement);

    if(this.insertWhitespace) {
      // The space is used as natural spacer, to mimic inline input behaviour
      this.inputElement.insertAdjacentText('beforebegin', ' ');
    }

    const entry = {
      string: filteredEntryString,
      isValid: isValidEntry,
      element
    }

    this.entryList.push(entry);
    return entry;
  }

  public deleteEntry(element: Node): boolean {
    if(!this.listContainer.contains(element)) {
      return false;
    }

    this.entryList = this.entryList.filter(entry => entry.element !== element);
    this.listContainer.removeChild(element);

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
    if(typeof this.deleteNode === 'string') {
      deleteElement.innerHTML = this.deleteNode;
    }
    else {
      deleteElement.appendChild(this.deleteNode.cloneNode());
    }

    deleteElement.classList.add('entry-delete');
    deleteElement.addEventListener('click', () => {
      this.deleteEntry(element);
    })

    element.appendChild(deleteElement);

    if (this.insertWhitespace) {
      // The space is used as natural spacer, to mimic inline input behaviour
      deleteElement.insertAdjacentText('beforebegin', ' ');
    }

    return element;
  }
}

// Manually export to support testing through import
if(typeof exports === "object") {
  exports.EmailsInput = EmailsInput;
}