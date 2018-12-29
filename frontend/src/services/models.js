import $ from 'jquery';

class Manager {

    constructor(ajax) {
        this.ajax = ajax;
    }

    createFeatureRequest(fr) {
        return this.ajax.fetch('/api/feature_requests', {
            method: "POST",
            contentType: 'application/json',
            data: JSON.stringify(fr)
        });
    }

    getClient(clientId) {
        return this.ajax.fetch('/api/clients/' + clientId);
    }

    listClients() {
        return this.ajax.fetch('/api/clients');
    }

    listAreas() {
        return this.ajax.fetch('/api/areas');
    }

    listFeatureRequests(filter) {
        return new Promise((resolve, reject) => {
            let url = '/api/feature_requests?client=' + filter.clientId;
            if (filter.limit) {
                url += "&limit=" + filter.limit;
            }
            if (filter.offset) {
                url += "&offset=" + filter.offset;
            }
            if (filter.search) {
                url += "&search=" + filter.search;
            }
            if (filter.area) {
                url += "&area=" + filter.area;
            }
            if (filter.sort) {
                url += "&sort=" + filter.sort;
            }
            if (filter.archived) {
                url += "&include_archived=1";
            }
            this.ajax.fetch(url).then((data, status, jqXHR) => {
                resolve({ items: data, totalItems: parseInt(jqXHR.getResponseHeader('x-total-results')) });
            })
        });
    }

    getFeatureRequest(id) {
        this.ajax.fetch('/api/feature_requests/' + id).then(console.log);
        return this.ajax.fetch('/api/feature_requests/' + id);
    }

    updateFeatureRequest(id, fr) {
        return this.ajax.fetch('/api/feature_requests/' + id, {
            method: "PUT",
            contentType: 'application/json',
            data: JSON.stringify(fr)
        });
    }
}
export default Manager;