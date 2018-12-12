import $ from 'jquery';

class Client {
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.activeFeatureRequests = data.activeFeatureRequests;
    }
}

class Area {
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
    }
}

class FeatureRequestSummary {
    constructor(data) {
        this.title = data.title;
        this.id = data.id;
        this.priority = data.priority;
        this.area = data.area;
        this.targetDate = data.targetDate;
        this.lastUpdate = data.lastUpdate;
    }
}


let clients = [
    new Client({
        name: "client 1",
        id: 1,
        activeFeatureRequests: 2
    }),
    new Client({
        name: "client 2",
        id: 2,
        activeFeatureRequests: 1
    }),
];

let featureRequests = $.map([{
    title: "Feature 1",
    id: 1,
    priority: 1,
    area: { id: 1, name: "Software" },
    targetDate: "20 Jul 2018",
    lastUpdate: "20 Jul 2018",
}, {
    title: "Feature 2",
    id: 2,
    priority: 2,
    area: { id: 1, name: "Software" },
    targetDate: "20 Jul 2018",
    lastUpdate: "20 Jul 2018",
}, {
    title: "Feature 3",
    id: 3,
    priority: 3,
    area: { id: 1, name: "Software" },
    targetDate: "20 Jul 2018",
    lastUpdate: "20 Jul 2018",
}], d => new FeatureRequestSummary(d));

class Manager {
    createFeatureRequest(data) {
        return new Promise((resolve, reject) => {
            featureRequests.push(new FeatureRequestSummary(
                Object.assign({}, data, { id: featureRequests.length + 1, lastUpdate: "now" })
            ));
            resolve(56);
        });
    }

    getClient(clientId) {
        return new Promise((resolve, reject) => {
            resolve(clients.find(c => c.id == clientId));
        });
    }

    listClients() {
        return new Promise((resolve, reject) => {
            resolve(clients);
        });
    }

    listAreas() {
        return new Promise((resolve, reject) => {
            resolve([
                new Area({
                    name: "Claims",
                    id: 1
                }),
                new Area({
                    name: "Payments",
                    id: 2
                })
            ]);
        });
    }

    getFeatureRequests(filter) {
        return new Promise((resolve, reject) => {
            resolve(featureRequests);
        });
    }
}

export default Manager;