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
            this.featureRequest(fr);
            this.client(fr.client);
            this.maxPriority(this.client().active_feature_requests + (this.featureRequest().is_archived ? 1 : 0), this);
        });
        this.handleSave = this.handleSave.bind(this);
        this.handleArchive = this.handleArchive.bind(this);
        this.handleUnarchive = this.handleUnarchive.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.showArchive = ko.pureComputed(() => !this.featureRequest().is_archived, this);
        this.showDelete = ko.pureComputed(() => this.featureRequest().is_archived, this);
    }

    handleDelete() {
        this.model.deleteFeatureRequest(this.featureRequest().id).then(() => {
            this.appState.setFlash(`Deleted #${this.featureRequest().id}`);
            this.router.goRoute('client-board', { clientId: this.featureRequest().client.id });
        });
    }

    handleArchive() {
        this.handleSave({ is_archived: true }, false);
    }

    handleUnarchive() {
        this.handleSave({ is_archived: false }, false);
    }

    handleSave(data, goBack) {
        data = Object.assign(this.featureRequest(), data);
        this.featureRequest(data);
        let params = {
            title: data.title,
            description: data.description,
            area: data.area.id,
            target_date: data.target_date,
            priority: data.priority,
            is_archived: data.is_archived
        };
        this.model.updateFeatureRequest(this.featureRequest().id, params).then(() => {
            this.appState.setFlash(`Saved #${this.featureRequest().id}`);
            if (goBack !== false) {
                this.router.goRoute('client-board', { clientId: this.featureRequest().client.id });
            }
        });
    }
}

export default { viewModel: FeatureRequestEditViewModel, template: template };