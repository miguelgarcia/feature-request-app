import ko from 'knockout';
import routerInstance from './router';
import aboutTemplate from '../components/about-page/about.html';
import homeComponent from '../components/home-page/home';
import navBarComponent from '../components/nav-bar/nav-bar';
import clientSelectComponent from '../components/client-select';
import clientBoardComponent from '../components/client-board';
import featureRequestCardComponent from '../components/feature-request-card';
import AppState from './appstate';

import 'bootstrap/dist/css/bootstrap.min.css';

// Register components
ko.components.register('nav-bar', navBarComponent);
ko.components.register('home-page', homeComponent);
ko.components.register('client-select', clientSelectComponent);
ko.components.register('client-board', clientBoardComponent);
ko.components.register('feature-request-card', featureRequestCardComponent);

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: aboutTemplate
});

// Start the application
ko.applyBindings({
    route: routerInstance.currentRoute,
    appState: new AppState()
});