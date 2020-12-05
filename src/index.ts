class EmailsInput {
  container: HTMLElement;

  cunstructor(container: HTMLElement) {
    if(container) {
      throw new Error('Did you forget to provide a container?');
    }

    this.container = container;
  }
}