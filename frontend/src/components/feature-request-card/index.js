import template from './feature-request-card.html';

class FeatureRequestCardViewModel {
    constructor(params) {
        this.featureRequest = params.featureRequest;
    }
}
export default { viewModel: FeatureRequestCardViewModel, template: template };