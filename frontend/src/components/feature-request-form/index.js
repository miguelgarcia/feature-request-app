import ko from 'knockout';
import template from './feature-request-form.html';
import '../text-input';
import '../textarea-input';
import '../range-input';
import '../select-input';
import '../date-input';


class FeatureRequestFormViewModel {
    constructor(params) {
        this.areas = params.areas;
        this.client = params.client;
        this.maxPriority = ko.computed(() => this.client().activeFeatureRequests + 1, this);
        this.onSubmit = params.onSubmit;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.formDirty = ko.observable(false);

        this.title = ko.observable("");
        this.titleError = ko.pureComputed(() => {
            return this.title() == "" ? "This value is required" : "";
        }, this);

        this.description = ko.observable("");
        this.descriptionError = ko.computed(() => {
            return this.description() == "" ? "This value is required" : "";
        }, this);

        this.area = ko.observable();
        this.areas = ko.observableArray()
        this.areaError = ko.computed(() => {
            return !this.area() ? "This value is required" : "";
        }, this);
        params.appState.model.listAreas().then(this.areas);

        this.targetDate = ko.observable("");
        this.targetDateError = ko.pureComputed(() => {
            return this.targetDate() == "" ? "This value is required" : "";
        }, this);

        this.priority = ko.observable(1);
        this.maxPriority = ko.pureComputed(() => this.client().activeFeatureRequests + 1, this)

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