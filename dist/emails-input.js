var EmailsInput = (function () {
    function EmailsInput(container) {
        this.entryList = [];
        this.delimiter = ',';
        this.validityRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        this.placeholderText = 'add more people...';
        this.deleteNode = '&times;';
        this.insertWhitespace = true;
        if (!container) {
            throw new Error('Did you forget to provide a container?');
        }
        if (container.hasChildNodes()) {
            console.warn('The container does not seem to be empty, are you sure?', container);
        }
        this.container = container;
        this.scaffoldStructure();
        this.bindEventListeners();
    }
    EmailsInput.prototype.scaffoldStructure = function () {
        this.listContainer = document.createElement('span');
        this.listContainer.classList.add('entry-list');
        this.inputElement = document.createElement('input');
        this.inputElement.setAttribute('type', 'text');
        this.inputElement.setAttribute('placeholder', this.placeholderText);
        this.inputElement.classList.add('entry-input');
        this.listContainer.append(this.inputElement);
        this.container.append(this.listContainer);
    };
    EmailsInput.prototype.bindEventListeners = function () {
        this.inputElement.addEventListener('input', this.processInput.bind(this));
        this.inputElement.addEventListener('keydown', this.processKeydown.bind(this));
        this.inputElement.addEventListener('blur', this.processBlur.bind(this));
    };
    EmailsInput.prototype.processInput = function (event) {
        var input = this.inputElement.value;
        if (input.indexOf(this.delimiter) == -1) {
            return;
        }
        var entries = input.split(this.delimiter);
        entries.forEach(this.addEntry.bind(this));
    };
    EmailsInput.prototype.processKeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.addEntry();
        }
    };
    EmailsInput.prototype.processBlur = function (event) {
        this.addEntry();
    };
    EmailsInput.prototype.addEntry = function (entryString) {
        if (entryString === void 0) { entryString = this.inputElement.value; }
        var filteredEntryString = entryString.trim();
        if (filteredEntryString.length == 0) {
            return;
        }
        var isValidEntry = this.validityRegex.test(filteredEntryString);
        var element = this.createEntryElement(filteredEntryString, isValidEntry);
        this.listContainer.insertBefore(element, this.inputElement);
        if (this.insertWhitespace) {
            this.inputElement.before(' ');
        }
        this.inputElement.value = '';
        this.entryList.push({
            string: filteredEntryString,
            isValid: isValidEntry,
            element: element
        });
    };
    EmailsInput.prototype.deleteEntry = function (element) {
        this.entryList = this.entryList.filter(function (entry) { return entry.element !== element; });
        this.listContainer.removeChild(element);
    };
    EmailsInput.prototype.createEntryElement = function (content, isValid) {
        var _this = this;
        var element = document.createElement('span');
        element.textContent = content;
        element.classList.add('entry');
        element.classList.add(isValid ? 'valid' : 'invalid');
        var deleteElement = document.createElement('button');
        if (typeof this.deleteNode === 'string') {
            deleteElement.innerHTML = this.deleteNode;
        }
        else {
            deleteElement.append(this.deleteNode.cloneNode());
        }
        deleteElement.classList.add('entry-delete');
        deleteElement.addEventListener('click', function () {
            _this.deleteEntry(element);
        });
        element.append(deleteElement);
        if (this.insertWhitespace) {
            deleteElement.before(' ');
        }
        return element;
    };
    return EmailsInput;
}());
//# sourceMappingURL=emails-input.js.map