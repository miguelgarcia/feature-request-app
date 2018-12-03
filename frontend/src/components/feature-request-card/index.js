import template from './feature-request-card.html';

class FeatureRequestCardViewModel {
    constructor(params) {
        this.featureRequest = params.featureRequest;
        this.isDragged = params.isDragged;
        this.isDropArea = params.isDropArea;
    }
}
export default { viewModel: FeatureRequestCardViewModel, template: template };