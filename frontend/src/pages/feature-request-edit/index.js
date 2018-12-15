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
        this.client = ko.observable();
        this.maxPriority = ko.observable(1);
        this.model.getFeatureRequest(featureRequestId).then(fr => {
            fr.archived = true;
            this.featureRequest(fr);
            this.client(fr.client);
            this.maxPriority(this.client().activeFeatureRequests + (this.featureRequest().archived ? 1 : 0), this);
        });
        this.handleSave = this.handleSave.bind(this);
        this.handleArchive = this.handleArchive.bind(this);
        this.handleUnarchive = this.handleUnarchive.bind(this);
        this.showArchive = ko.pureComputed(() => !this.featureRequest().archived, this);
    }

    handleArchive() {
        this.featureRequest(Object.assign(this.featureRequest(), { archived: true }));
    }

    handleUnarchive() {
        this.featureRequest(Object.assign(this.featureRequest(), { archived: false }));
    }

    handleSave(data) {
        data = Object.assign(this.featureRequest(), data);
        this.featureRequest(data);
        this.model.updateFeatureRequest(data).then(() => this.appState.setFlash("Saved ..."));
    }
}

export default { viewModel: FeatureRequestEditViewModel, template: template };