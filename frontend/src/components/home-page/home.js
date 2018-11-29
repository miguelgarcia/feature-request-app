import ko from 'knockout';
import homeTemplate from './home.html';

class HomeViewModel {
    constructor(route) {
        this.message = ko.observable('Welcome to Feature Requests!');
    }

    doSomething() {
        this.message('You invoked doSomething() on the viewmodel.');
    }
}
export default { viewModel: HomeViewModel, template: homeTemplate };