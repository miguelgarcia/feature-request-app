import ko from 'knockout';
import template from './paged-grid.html';

class PagedGridViewModel {
    constructor(params) {
        this.rows = params.rows;
        this.rowComponent = params.rowComponent;
        this.pages = params.pages;
        this.currentPage = params.currentPage;

        this.pagesList = ko.pureComputed(() => {
            let pagesList = [];
            for (let i = 1; i <= this.pages(); i++) {
                pagesList.push({ page: i });
            }
            return pagesList;
        }, this);

        this.setPage = this.setPage.bind(this);
    }

    setPage(page) {
        this.currentPage(page.page);
    }
}

ko.components.register('paged-grid', { viewModel: PagedGridViewModel, template: template });

export default { viewModel: PagedGridViewModel, template: template };