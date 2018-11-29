import ko from 'knockout';
import routerInstance from './router';
import aboutTemplate from '../components/about-page/about.html';
import homeComponent from '../components/home-page/home';
import navBarComponent from '../components/nav-bar/nav-bar';
import clientSelectComponent from '../components/client-select';

import 'bootstrap/dist/css/bootstrap.min.css';
// Components can be packaged as AMD modules, such as the following:
ko.components.register('nav-bar', navBarComponent);
ko.components.register('home-page', homeComponent);
ko.components.register('client-select', clientSelectComponent);

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: aboutTemplate
});

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

// Start the application
ko.applyBindings({ route: routerInstance.currentRoute });