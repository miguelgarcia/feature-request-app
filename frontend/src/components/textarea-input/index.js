import ko from 'knockout';
import template from './textarea-input.html';

class TextareaInputViewModel {
    constructor(params) {
        this.value = params.value;
        this.placeholder = params.placeholder;
        this.label = params.label;
        this.controlId = params.controlId;
        this.error = params.error;
        this.rows = params.rows;
        this.required = params.required;
        this.dirty = params.dirty;
        this.valid = ko.pureComputed(() => {
            return this.error() == ''
        }, this);
    }
}

ko.components.register('textarea-input', { viewModel: TextareaInputViewModel, template: template });

export default { viewModel: TextareaInputViewModel, template: template };