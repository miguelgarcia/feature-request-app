import ko from 'knockout';
import ModelsManager from '../services/models';

class AppState {
    constructor() {
        this.model = new ModelsManager();
    }
}

export default AppState;