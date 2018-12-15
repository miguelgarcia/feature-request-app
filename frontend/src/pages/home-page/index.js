import ko from 'knockout';
import homeTemplate from './home.html';
import jq from 'jquery'
import '../../components/client-select';

class HomeViewModel {
    constructor(params) {
        this.appState = params.appState;
        this.router = params.router;
        this.onClientSelect = this.onClientSelect.bind(this);
    }

    onClientSelect(client) {
        jq('#selectClientModal').modal('hide');
        this.router.goRoute('client-board', { clientId: client.id });
    }
}

export default { viewModel: HomeViewModel, template: homeTemplate };