import ko from 'knockout';
import routerInstance from './router';
import aboutTemplate from '../pages/about-page/about.html';
import navBarComponent from '../components/nav-bar/nav-bar';
import AppState from './appstate';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import './app.css';


// Register components
ko.components.register('nav-bar', navBarComponent);

// Component loader from ES6 modules
var myComponentLoader = {
    loadComponent: function(name, componentConfig, callback) {
        if (!componentConfig.myLoader) {
            return ko.components.defaultLoader.loadComponent(name, componentConfig, callback);
        }
        console.log("Loading:", name);
        componentConfig.myLoader().then(function(loadedComponent) {

            var result = {
                template: ko.utils.parseHtmlFragment(loadedComponent.default.template),
                createViewModel: params => new loadedComponent.default.viewModel(params)
            }
            callback(result);
        })
    }
};

// Register it
ko.components.loaders.unshift(myComponentLoader);


ko.components.register('client-board', {
    myLoader: () =>
        import ('../pages/client-board')
});
ko.components.register('home-page', {
    myLoader: () =>
        import ('../pages/home-page/home')
});

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: aboutTemplate
});

// Start the application
ko.applyBindings({
    currentPage: routerInstance.currentPage,
    route: routerInstance.currentRoute,
    appState: new AppState()
});