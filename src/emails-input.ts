class EmailsInput {
  container: HTMLElement;

  cunstructor(container: HTMLElement) {
    if(container) {
      throw new Error('Did you forget to provide a container?');
    }

    if(container.hasChildNodes()) {
      console.warn('The container does not seem to be empty, are you sure?', container)
    }

    this.container = container;
  }
}