import ko from 'knockout';
import routerInstance from './router';
import AppState from './appstate';
import './registry';

import 'bootstrap/dist/css/bootstrap.min.css';
//import '@fortawesome/fontawesome-free/js/all';
import 'bootstrap/dist/js/bootstrap';
import './app.css';


let appState = new AppState();
// Start the application
ko.applyBindings({
    currentPage: routerInstance.currentPage,
    route: routerInstance.currentRoute,
    router: routerInstance,
    appState: appState,
    flash: appState.flash,
    pendingAjax: appState.pendingAjax,
});