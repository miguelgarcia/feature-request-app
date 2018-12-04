import ko from 'knockout';
import template from './template.html';

class ClientSelectViewModel {
    constructor(params) {
        this.appState = params.appState;
        this.onChangeCallback = params.onChange;
        this.selectedClient = ko.observable();
        this.selectedClient.subscribe(this.handleChange, this);
        this.clients = ko.observableArray()
        let model = params.appState.model;
        model.listClients().then(clients => this.clients(clients));
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange() {
        if (this.selectedClient()) {
            if (this.onChangeCallback) {
                this.onChangeCallback(this.selectedClient());
            }
        }
    }
}

ko.components.register('client-select', { viewModel: ClientSelectViewModel, template: template });

export default { viewModel: ClientSelectViewModel, template: template };