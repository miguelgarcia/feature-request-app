import ko from 'knockout';
import aboutTemplate from '../pages/about-page/about.html';
import navBarComponent from '../components/nav-bar/nav-bar';

// Register components
ko.components.register('nav-bar', navBarComponent);

// Component loader from ES6 modules
var myComponentLoader = {
    loadComponent: function(name, componentConfig, callback) {
        if (!componentConfig.pageLoader) {
            return ko.components.defaultLoader.loadComponent(name, componentConfig, callback);
        }
        componentConfig.pageLoader().then(function(loadedComponent) {

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
    pageLoader: () =>
        import ('../pages/client-board')
});
ko.components.register('home-page', {
    pageLoader: () =>
        import ('../pages/home-page')
});
ko.components.register('feature-request-new', {
    pageLoader: () =>
        import ('../pages/feature-request-new')
});
ko.components.register('feature-request-edit', {
    pageLoader: () =>
        import ('../pages/feature-request-edit')
});

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: aboutTemplate
});