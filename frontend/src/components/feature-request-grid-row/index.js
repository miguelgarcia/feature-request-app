import ko from 'knockout';
import template from './feature-request-grid-row.html';

class FeatureRequestGridRowViewModel {
    constructor(params) {
        this.featureRequest = params.item;
    }
}

ko.components.register('feature-request-grid-row', { viewModel: FeatureRequestGridRowViewModel, template: template });

export default { viewModel: FeatureRequestGridRowViewModel, template: template };