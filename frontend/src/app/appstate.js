import ko from 'knockout';
import ModelsManager from '../services/models';

class AppState {
    constructor() {
        this.model = new ModelsManager();
        this.flash = ko.observable()
        this.lastTimeOut = undefined;
    }

    setFlash(msg) {
        this.flash(msg);
        if (this.lastTimeOut) {
            clearTimeout(this.lastTimeOut);
        }
        this.lastTimeOut = setTimeout(() => this.flash(false), 5000);
    }
}

export default AppState;