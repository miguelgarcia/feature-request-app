import ko from 'knockout';
import template from './template.html';

class ClientBoardViewModel {
    constructor(params) {
        let appState = params.appState;
        appState.setCurrentClient(params.route().clientId);
        // responsabilities:
        // - show client name
        // - list open feature requests
        // - allow resort
        // - show edit
        // - show new
        this.appState = appState;
        this.client = params.appState.client;
        this.featureRequests = params.appState.featureRequests;
        this.beingDragged = ko.observable();
        this.beingDraggedCard = undefined;
        this.dropArea = ko.observable();
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    onDragStart(card) {
        this.beingDraggedCard = card;
        this.beingDragged(card.id);
        return true;
    }

    onDrop(card) {
        this.appState.changePriority(this.beingDraggedCard, this.dropArea().priority);
        return true;
    }

    onDragEnter(card, evt) {
        this.dropArea(card);
        evt.preventDefault();
    }

    onDragEnd(card, evt) {
        this.beingDragged(undefined);
        this.dropArea(undefined);
    }
}
export default { viewModel: ClientBoardViewModel, template: template };