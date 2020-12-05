class EmailsInput {
  container: HTMLElement;
  listContainer: HTMLSpanElement;
  inputElement: HTMLInputElement;

  delimiter: string = ',';

  constructor(container: HTMLElement) {
    if(!container) {
      throw new Error('Did you forget to provide a container?');
    }

    if(container.hasChildNodes()) {
      console.warn('The container does not seem to be empty, are you sure?', container)
    }

    this.container = container;

    this.setup();
  }

  setup() {
    this.scaffoldStructure();
    this.bindEventListeners();
  }

  scaffoldStructure() {
    this.listContainer = document.createElement('span');
    this.inputElement = document.createElement('input');

    this.container.append(this.listContainer, this.inputElement);
  }

  bindEventListeners() {
    // this.inputElement.addEventListener('keydown', this.processInput.bind(this));
    this.inputElement.addEventListener('input', this.processInput.bind(this));
    this.inputElement.addEventListener('keydown', this.processKeydown.bind(this));
    this.inputElement.addEventListener('blur', this.processBlur.bind(this));
  }

  processInput(event: InputEvent) {
    const input = this.inputElement.value;
    if(input.indexOf(this.delimiter) == -1) {
      return;
    }

    const entries = input.split(this.delimiter);

    console.log(entries);

    entries.forEach(this.addEntry);
  }

  processKeydown(event: KeyboardEvent) {
    if(event.key === 'enter') {
      this.addEntry();
    }
  }

  processBlur(event: FocusEvent) {
    this.addEntry();
  }

  addEntry(entry: string = this.inputElement.value) {
    console.log(entry);
  }
}
