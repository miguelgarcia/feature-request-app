import ko from 'knockout';
import crossroads from 'crossroads';
import hasher from 'hasher';

// This module configures crossroads.js, a routing library. If you prefer, you
// can use any other routing library (or none at all) as Knockout is designed to
// compose cleanly with external libraries.
//
// You *don't* have to follow the pattern established here (each route entry
// specifies a 'page', which is a Knockout component) - there's nothing built into
// Knockout that requires or even knows about this technique. It's just one of
// many possible ways of setting up client-side routes.

class Router {
    constructor(config) {
        this.routes = config.routes;
        this.currentPage = ko.observable({});
        this.currentRoute = ko.observable({});

        // Configure Crossroads route handlers
        ko.utils.arrayForEach(this.routes, (route) => {
            crossroads.addRoute(route.url, (requestParams) => {
                this.currentPage(route.params.page);
                this.currentRoute(ko.utils.extend(requestParams, route.params));
            });
        });

        // Activate Crossroads
        crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;
        hasher.initialized.add(hash => crossroads.parse(hash));
        hasher.changed.add(hash => crossroads.parse(hash));
        hasher.init();
    }

    goTo(newPath) {
        hasher.setHash(newPath);
    }

    goRoute(routeName, params) {
        let route = this.routes.find(r => r.name == routeName);
        if (!route) {
            hasher.setHash("404");
        }
        let url = route.url;
        for (let p in params) {
            url = url.replace(`{${p}}`, params[p]);
        }
        hasher.setHash(url);
    }
}

// Create and export router instance
var routerInstance = new Router({
    routes: [
        { url: '', params: { page: 'home-page' } },
        { url: 'about', params: { page: 'about-page' } },
        { url: 'feature-request-new/{clientId}', params: { page: 'feature-request-new' } },
        { url: 'client-board/{clientId}', params: { page: 'client-board' }, name: 'client-board' },
        { url: 'client-board/{clientId}?p={p}', params: { page: 'client-board' } },
        { url: 'client-archive/{clientId}', params: { page: 'client-archive' } },
        { url: 'search', params: { page: 'search' } }
    ]
});

export default routerInstance;