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
            title: "Implement better filters",
            shortDescription: "Some quick example text to build on the card title and make up the bulk of the card's content",
            area: mockedAreas[j % mockedAreas.length],
            lastUpdate: "24/12/2018 12:38hs",
            targetDate: "24/12/2018",
            priority: j
        });
    }
}

class AppState {
    constructor() {
        this.client = ko.observable();
        this.featureRequest = ko.observable();
        this.featureRequests = ko.observableArray().extend({ deferred: true });
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
        //this.featureRequests()[0].title = "banana";
        //this.featureRequests.valueWillMutate();
        featureRequest.priority = newPriority;
        this.featureRequests()[featureRequest.id] = Object.assign({}, featureRequest)
        this.featureRequests.valueHasMutated();

        console.log(featureRequest, newPriority);
    }

    setFeatureRequest(featureRequestId) {

    }

    saveFeatureRequest() {

    }
}
export default AppState;