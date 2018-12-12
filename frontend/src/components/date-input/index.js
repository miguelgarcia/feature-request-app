import ko from 'knockout';
import template from './date-input.html';

class DateInputViewModel {
    constructor(params) {
        this.value = params.value;
        this.label = params.label;
        this.controlId = params.controlId;
        this.error = params.error;
        this.dirty = params.dirty;
        this.valid = ko.pureComputed(() => {
            return this.error() == ''
        }, this);
    }
}

ko.components.register('date-input', { viewModel: DateInputViewModel, template: template });

export default { viewModel: DateInputViewModel, template: template };