import ko from 'knockout';
import template from './feature-request-new.html';
import '../../components/feature-request-form';

class FeatureRequestNewViewModel {
    constructor(params) {
        let clientId = params.route().clientId;
        this.router = params.router;
        this.client = ko.observable();
        this.appState = params.appState;
        this.model = params.appState.model;
        this.model.getClient(clientId).then(this.client);
        this.handleSave = this.handleSave.bind(this);
    }

    handleSave(data) {
        data = Object.assign(data, { client: this.client() });
        this.model.createFeatureRequest(data).then(() =>
            this.router.goRoute('client-board', { clientId: this.client().id }));
    }
}

export default { viewModel: FeatureRequestNewViewModel, template: template };