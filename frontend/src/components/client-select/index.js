import ko from 'knockout';
import template from './template.html';

class ClientSelectViewModel {
    constructor(params) {
        this.appState = params.appState;
        this.onChangeCallback = params.onChange;
        this.selectedClient = ko.observable();
        this.selectedClient.subscribe(this.handleChange, this);
        this.clients = this.appState.clients;
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
export default { viewModel: ClientSelectViewModel, template: template };