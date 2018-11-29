import ko from 'knockout';
import template from './template.html';

class ClientSelectViewModel {
    constructor(route) {
        this.selectedClient = ko.observable();
        this.clients = ko.observableArray([
            { name: 'Bert', id: 1 },
            { name: 'Charles', id: 2 },
            { name: 'Denise', id: 3 }
        ]);
    }

    doSomething() {
        //this.message('You invoked doSomething() on the viewmodel.');
    }
}
export default { viewModel: ClientSelectViewModel, template: template };