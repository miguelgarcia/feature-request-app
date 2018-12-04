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
        this.model.getClient(clientId).then(client => this.client(client));
        this.model.getFeatureRequests(clientId).then(frs => {
            this.featureRequests(frs)
        });
        this.currentPage.subscribe(function(v) {
            hasher.setHash('client-board/' + clientId + '?p=' + v);
        });
    }
}
export default { viewModel: ClientBoardViewModel, template: template };