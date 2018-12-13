import ko from 'knockout';
import template from './template.html';
import hasher from 'hasher';
import '../../components/paged-grid';
import '../../components/feature-request-grid-row';

class ClientBoardViewModel {
    constructor(params) {
        let clientId = params.route().clientId;
        this.client = ko.observable({ id: clientId });
        this.currentPage = ko.observable(params.route().p || 1);
        this.pages = ko.observable(0);
        this.featureRequests = ko.observableArray();
        this.itemsPerPage = 10;
        this.model = params.appState.model;
        this.model.getClient(clientId).then(this.client);
        this.onPageChange = this.onPageChange.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.currentPage.subscribe(this.onPageChange);
        this.loadResults();
    }

    loadResults() {
        this.model.listFeatureRequests({ clientId: this.client().id }, this.currentPage()).then(
            (result) => {
                this.featureRequests(result.items);
                this.pages(Math.ceil(result.totalItems / this.itemsPerPage));
            }
        )
    }

    onPageChange(page) {
        hasher.setHash('client-board/' + this.client().id + '?p=' + page);
        this.loadResults();
    }

    onCreate() {
        hasher.setHash('feature-request-new/' + this.client().id);
    }
}
export default { viewModel: ClientBoardViewModel, template: template };