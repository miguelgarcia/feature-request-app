import ko from 'knockout';
import homeTemplate from './home.html';
import jq from 'jquery'
import hasher from 'hasher';

class HomeViewModel {
    constructor(params) {
        this.appState = params.appState;
        this.onClientSelect = this.onClientSelect.bind(this);
    }

    onClientSelect(client) {
        jq('#selectClientModal').modal('hide')
        hasher.setHash("client-board/" + client.id, "", "ch/au")
    }
}
export default { viewModel: HomeViewModel, template: homeTemplate };