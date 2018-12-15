import ko from 'knockout';
import template from './feature-request-form.html';
import '../text-input';
import '../textarea-input';
import '../range-input';
import '../select-input';
import '../date-input';


class FeatureRequestFormViewModel {
    constructor(params) {
        this.featureRequest = false;
        this.showArchive = params.showArchive;
        this.onArchive = params.onArchive;
        this.onUnarchive = params.onUnarchive;
        this.showUnarchive = params.showUnarchive;
        if (params.featureRequest) {
            this.featureRequest = params.featureRequest();
        }
        this.onSubmit = params.onSubmit;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.formDirty = ko.observable(false);

        this.title = ko.observable(this.featureRequest ? this.featureRequest.title : "");
        this.titleError = ko.pureComputed(() => {
            return this.title() == "" ? "This value is required" : "";
        }, this);

        this.description = ko.observable(this.featureRequest ? this.featureRequest.description : "");
        this.descriptionError = ko.computed(() => {
            return this.description() == "" ? "This value is required" : "";
        }, this);

        this.area = ko.observable();
        this.areas = ko.observableArray()
        this.areaError = ko.computed(() => {
            return !this.area() ? "This value is required" : "";
        }, this);

        params.appState.model.listAreas().then(areas => {
            this.areas(areas);
            if (this.featureRequest) {
                this.area(areas.find(a => a.id == this.featureRequest.area.id));
            }
        });

        this.targetDate = ko.observable(this.featureRequest ? this.featureRequest.targetDate : "");
        this.targetDateError = ko.pureComputed(() => {
            return this.targetDate() == "" ? "This value is required" : "";
        }, this);

        this.priority = ko.observable(this.featureRequest ? this.featureRequest.priority : 1);
        this.maxPriority = params.maxPriority;

        this.formValid = ko.pureComputed(() => this.titleError() == "" && this.descriptionError() == "" && this.areaError() == "" && this.targetDateError() == "", this);
    }

    handleSubmit() {
        this.formDirty(true);
        if (!this.formValid()) {
            return;
        }

        this.onSubmit({
            title: this.title(),
            description: this.description(),
            area: this.area(),
            targetDate: this.targetDate(),
            priority: this.priority()
        });
    }
}

ko.components.register('feature-request-form', { viewModel: FeatureRequestFormViewModel, template: template });

export default { viewModel: FeatureRequestFormViewModel, template: template };