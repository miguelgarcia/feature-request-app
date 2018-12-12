import ko from 'knockout';
import template from './template.html';
import hasher from 'hasher';
import '../../components/paged-grid';
import '../../components/feature-request-grid-row';

class ClientBoardViewModel {
    constructor(params) {
        let clientId = params.route().clientId;
        this.client = ko.observable({});
        this.currentPage = ko.observable(params.route().p || 1);
        this.pages = ko.observable(10);
        this.featureRequests = ko.observableArray();

        this.model = params.appState.model;
        this.model.getClient(clientId).then(this.client);
        this.model.getFeatureRequests(clientId).then(this.featureRequests);
        this.onPageChange = this.onPageChange.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.currentPage.subscribe(this.onPageChange);
    }

    onPageChange(page) {
        hasher.setHash('client-board/' + this.client().id + '?p=' + page);
    }

    onCreate() {
        hasher.setHash('feature-request-new/' + this.client().id);
    }
}
export default { viewModel: ClientBoardViewModel, template: template };