class EmailsInput {
  container: HTMLElement;
  listContainer: HTMLSpanElement;
  inputElement: HTMLInputElement;

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
  }

  scaffoldStructure() {
    this.listContainer = document.createElement('span');
    this.inputElement = document.createElement('input');

    this.container.append(this.listContainer, this.inputElement);
  }
}