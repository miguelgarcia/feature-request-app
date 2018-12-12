import ko from 'knockout';
import template from './range-input.html';

class RangeInputViewModel {
    constructor(params) {
        this.value = params.value;
        this.label = params.label;
        this.controlId = params.controlId;
        this.max = params.max;
    }
}

ko.components.register('range-input', { viewModel: RangeInputViewModel, template: template });

export default { viewModel: RangeInputViewModel, template: template };