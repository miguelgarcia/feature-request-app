import ko from 'knockout';
import template from './feature-request-edit.html';
import '../../components/feature-request-form';

class FeatureRequestEditViewModel {
    constructor(params) {
        this.appState = params.appState;
        this.router = params.router;
        this.model = params.appState.model;

        let featureRequestId = params.route().featureRequestId;
        this.featureRequest = ko.observable();
        this.model.getFeatureRequest(featureRequestId).then(this.featureRequest);
        this.handleSave = this.handleSave.bind(this);
    }

    handleSave(data) {
        data = Object.assign(this.featureRequest(), data);
        this.model.updateFeatureRequest(data).then(() =>
            this.router.goRoute('client-board', { clientId: this.featureRequest().client.id }));
    }
}

export default { viewModel: FeatureRequestEditViewModel, template: template };