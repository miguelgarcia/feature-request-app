import ko from 'knockout';
import Ajax from '../services/ajax';
import ModelsManager from '../services/models';

class AppState {
    constructor() {
        this.pendingAjax = ko.observable(0)
        this.ajax = new Ajax(this.pendingAjax, this.onAuthError);
        this.model = new ModelsManager(this.ajax);
        this.flash = ko.observable()
        this.lastTimeOut = undefined;
    }

    onAuthError() {
        document.location = '/auth/login?error';
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