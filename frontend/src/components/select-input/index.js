import ko from 'knockout';
import template from './select-input.html';

class SelectInputViewModel {
    constructor(params) {
        this.value = params.value;
        this.options = params.options;
        this.optionsText = params.optionsText;
        this.optionsCaption = params.optionsCaption;
        this.label = params.label;
        this.controlId = params.controlId;
        this.error = params.error;
        this.dirty = params.dirty;
        this.valid = ko.pureComputed(() => {
            return this.error() == ''
        }, this);
    }
}

ko.components.register('select-input', { viewModel: SelectInputViewModel, template: template });

export default { viewModel: SelectInputViewModel, template: template };