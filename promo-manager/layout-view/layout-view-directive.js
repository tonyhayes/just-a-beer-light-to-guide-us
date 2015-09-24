import layoutViewTemplate from './partials/layout-view.html!text';
export default function layoutView() {
    return {
        restrict: 'A',
        scope: {
            'context': '='
        },
        controller: 'layoutViewController',
        controllerAs: 'ctrl',
        template: layoutViewTemplate,
        bindToController: true,
        link: function (scope, elem) {
            //workaround until I figure out why page not displaying
            $('#tabLayoutView').on('click', function (e) {
                scope.$root.$digest();
            });
        }

    };
}

