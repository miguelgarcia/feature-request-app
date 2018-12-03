import ko from 'knockout';

let mockedClients = [{
        id: 1,
        name: "Company A",
        featureRequests: []

    },
    {
        id: 2,
        name: "Another Company Inc.",
        featureRequests: []
    },
    {
        id: 3,
        name: "CompThree",
        featureRequests: []
    }
]

let mockedAreas = ['HHRR', 'Software Development', 'Research'];

for (let i = 0; i < mockedClients.length; i++) {
    for (let j = 0; j < 20; j++) {
        mockedClients[i].featureRequests.push({
            id: i * 20 + j,
            title: "Implement better filters #" + j,
            shortDescription: "Some quick example text to build on the card title and make up the bulk of the card's content",
            area: mockedAreas[j % mockedAreas.length],
            lastUpdate: "24/12/2018 12:38hs",
            targetDate: "24/12/2018",
            priority: j + 1
        });
    }
}

class AppState {
    constructor() {
        this.client = ko.observable();
        this.featureRequest = ko.observable();
        this.featureRequests = ko.observableArray().extend({ deferred: true });
        this.clients = ko.observableArray(mockedClients.map(c => {
            return { id: c.id, name: c.name, }
        }));
    }

    setCurrentClient(clientId) {
        this.client({});
        this.featureRequests([]);
        let clientIdInt = parseInt(clientId) - 1;
        if (mockedClients[clientIdInt]) {
            this.client(mockedClients[clientIdInt]);
            this.featureRequests(this.client().featureRequests);
        }
    }

    changePriority(featureRequest, newPriority) {
        let oldPriority = featureRequest.priority;
        if (oldPriority == newPriority) {
            return;
        }
        if (oldPriority < newPriority) {
            for (let i = oldPriority + 1; i <= newPriority; i++) {
                this.featureRequests()[i - 1] = Object.assign({}, this.featureRequests()[i - 1], { priority: i - 1 });
            }
        } else {
            for (let i = newPriority; i < oldPriority; i++) {
                this.featureRequests()[i - 1] = Object.assign({}, this.featureRequests()[i - 1], { priority: i + 1 });
            }
        }
        this.featureRequests()[oldPriority - 1] = Object.assign({}, featureRequest, { priority: newPriority });
        this.featureRequests.sort((a, b) => a.priority - b.priority);
    }

    setFeatureRequest(featureRequestId) {

    }

    saveFeatureRequest() {

    }
}
export default AppState;