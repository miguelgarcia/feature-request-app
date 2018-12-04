import $ from 'jquery';

class Client {
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


class Manager {
    getClient(clientId) {
        return new Promise((resolve, reject) => {
            resolve(new Client({
                name: "client " + clientId,
                id: clientId
            }));
        });
    }

    listClients() {
        return new Promise((resolve, reject) => {
            resolve([
                new Client({
                    name: "client 1",
                    id: 1
                })
            ]);
        });
    }

    getFeatureRequests(filter) {
        return new Promise((resolve, reject) => {
            resolve(
                $.map([{
                    title: "Feature 1",
                    id: 1,
                    priority: 1,
                    area: "Software",
                    targetDate: "20 Jul 2018",
                    lastUpdate: "20 Jul 2018",
                }, {
                    title: "Feature 2",
                    id: 2,
                    priority: 2,
                    area: "Software",
                    targetDate: "20 Jul 2018",
                    lastUpdate: "20 Jul 2018",
                }, {
                    title: "Feature 3",
                    id: 3,
                    priority: 3,
                    area: "Software",
                    targetDate: "20 Jul 2018",
                    lastUpdate: "20 Jul 2018",
                }], d => new FeatureRequestSummary(d))
            );
        });
    }
}

export default Manager;