import ko from 'knockout';
import template from './text-input.html';

class TextInputViewModel {
    constructor(params) {
        this.value = params.value;
        this.placeholder = params.placeholder;
        this.label = params.label;
        this.required = params.required;
        this.controlId = params.controlId;
        this.error = params.error;
        this.dirty = params.dirty;
        this.valid = ko.pureComputed(() => {
            return this.error() == ''
        }, this);
    }
}

ko.components.register('text-input', { viewModel: TextInputViewModel, template: template });

export default { viewModel: TextInputViewModel, template: template };