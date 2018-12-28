import ko from 'knockout';
import template from './template.html';
import hasher from 'hasher';
import '../../components/paged-grid';
import '../../components/text-input';
import '../../components/select-input';
import '../../components/feature-request-grid-row';
import { throws } from 'assert';

class ClientBoardViewModel {
    constructor(params) {
        let route = params.route();
        this.itemsPerPage = 10;
        this.model = params.appState.model;

        // client
        let clientId = route.clientId;
        this.client = ko.observable({ id: clientId });
        this.model.getClient(clientId).then(this.client);
        // current results
        this.pages = ko.observable(0);
        this.featureRequests = ko.observableArray();
        // filters
        let query = route['?query'] || {};
        this.search = ko.observable(query.s || "");
        this.area = ko.observable();
        this.includeArchived = ko.observable(query.archived);
        this.areas = ko.observableArray();
        this.currentPage = ko.observable(query.p || 1);
        params.appState.model.listAreas().then(areas => {
            this.areas(areas);
            if (params.route().area) {
                this.area(areas.find(a => a.id == query.area));
            }
        });
        // sorting
        this.sortOptions = [
            { name: 'Priority', id: 'prio' },
            { name: '#', id: 'id' },
            { name: 'Target Date', id: 'td' }
        ];
        this.sort = ko.observable(query.sort ? this.sortOptions.find(a => a.id == query.sort) : this.sortOptions[0]);


        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.area.subscribe(this.handleSearch);
        this.includeArchived.subscribe(this.handleSearch);
        this.sort.subscribe(this.handleSearch);
        this.setSearchCriteria();
        this.loadResults();
    }

    setSearchCriteria() {
        this.searchCriteria = {
            search: this.search(),
            area: this.area(),
            archived: this.includeArchived(),
            sort: this.sort()
        }
    }

    loadResults() {
        hasher.setHash('client-board/' + this.client().id +
            '?s=' + this.searchCriteria.search +
            "&p=" + this.currentPage() +
            "&sort=" + (this.searchCriteria.sort ? this.searchCriteria.sort.id : this.sortOptions[0].id) +
            (this.searchCriteria.area ? "&area=" + this.searchCriteria.area.id : '') +
            (this.searchCriteria.archived ? "&archived=1" : ''));

        this.model.listFeatureRequests({ clientId: this.client().id, limit: this.itemsPerPage, offset: this.itemsPerPage * (this.currentPage() - 1) }).then(
            (result) => {
                this.featureRequests(result.items);
                this.pages(Math.ceil(result.totalItems / this.itemsPerPage));
            }
        )
    }

    handlePageChange(page) {
        this.loadResults();
    }

    handleCreate() {
        hasher.setHash('feature-request-new/' + this.client().id);
    }

    handleSearch() {
        this.setSearchCriteria();
        this.currentPage(1);
        this.loadResults();
    }
}
export default { viewModel: ClientBoardViewModel, template: template };