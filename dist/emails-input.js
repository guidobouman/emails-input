var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var EmailsInput = (function () {
    function EmailsInput(container, options) {
        if (options === void 0) { options = {}; }
        this.entryList = [];
        if (!container) {
            throw new Error('Did you forget to provide a container?');
        }
        if (container.hasChildNodes()) {
            console.warn('The container does not seem to be empty, are you sure?', container);
        }
        this.container = container;
        this.config = __assign({ delimiter: ',', validityRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, placeholderText: 'add more people...', deleteNode: '&times;', insertWhitespace: true }, options);
        this.scaffoldStructure();
        this.bindEventListeners();
    }
    EmailsInput.prototype.scaffoldStructure = function () {
        this.listContainer = document.createElement('span');
        this.listContainer.classList.add('entry-list');
        this.inputElement = document.createElement('input');
        this.inputElement.setAttribute('type', 'text');
        this.inputElement.setAttribute('placeholder', this.config.placeholderText);
        this.inputElement.classList.add('entry-input');
        this.listContainer.appendChild(this.inputElement);
        this.container.appendChild(this.listContainer);
    };
    EmailsInput.prototype.bindEventListeners = function () {
        this.inputElement.addEventListener('input', this.processInput.bind(this));
        this.inputElement.addEventListener('keydown', this.processKeydown.bind(this));
        this.inputElement.addEventListener('blur', this.processBlur.bind(this));
    };
    EmailsInput.prototype.processInput = function (event) {
        var input = this.inputElement.value;
        if (input.indexOf(this.config.delimiter) == -1) {
            return;
        }
        var entries = input.split(this.config.delimiter);
        entries.forEach(this.addEntry.bind(this));
        this.inputElement.value = '';
    };
    EmailsInput.prototype.processKeydown = function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.addEntry();
            this.inputElement.value = '';
        }
    };
    EmailsInput.prototype.processBlur = function (event) {
        this.addEntry();
        this.inputElement.value = '';
    };
    EmailsInput.prototype.addEntry = function (entryString) {
        if (entryString === void 0) { entryString = this.inputElement.value; }
        var filteredEntryString = entryString.trim();
        if (filteredEntryString.length == 0) {
            return;
        }
        var isValidEntry = this.config.validityRegex.test(filteredEntryString);
        var element = this.createEntryElement(filteredEntryString, isValidEntry);
        this.listContainer.insertBefore(element, this.inputElement);
        if (this.config.insertWhitespace) {
            this.inputElement.insertAdjacentText('beforebegin', ' ');
        }
        var entry = {
            string: filteredEntryString,
            isValid: isValidEntry,
            element: element
        };
        this.entryList.push(entry);
        return entry;
    };
    EmailsInput.prototype.deleteEntry = function (element) {
        if (!this.listContainer.contains(element)) {
            return false;
        }
        this.entryList = this.entryList.filter(function (entry) { return entry.element !== element; });
        this.listContainer.removeChild(element);
        return true;
    };
    EmailsInput.prototype.getEntries = function (includeInvalidEntries) {
        if (includeInvalidEntries === void 0) { includeInvalidEntries = false; }
        return this.entryList.filter(function (entry) { return includeInvalidEntries || entry.isValid; });
    };
    EmailsInput.prototype.createEntryElement = function (content, isValid) {
        var _this = this;
        var element = document.createElement('span');
        element.textContent = content;
        element.classList.add('entry');
        element.classList.add(isValid ? 'valid' : 'invalid');
        var deleteElement = document.createElement('button');
        if (typeof this.config.deleteNode === 'string') {
            deleteElement.innerHTML = this.config.deleteNode;
        }
        else {
            deleteElement.appendChild(this.config.deleteNode.cloneNode(true));
        }
        deleteElement.classList.add('entry-delete');
        deleteElement.addEventListener('click', function () {
            _this.deleteEntry(element);
        });
        element.appendChild(deleteElement);
        if (this.config.insertWhitespace) {
            deleteElement.insertAdjacentText('beforebegin', ' ');
        }
        return element;
    };
    return EmailsInput;
}());
if (typeof exports === "object") {
    exports.EmailsInput = EmailsInput;
}
//# sourceMappingURL=emails-input.js.map