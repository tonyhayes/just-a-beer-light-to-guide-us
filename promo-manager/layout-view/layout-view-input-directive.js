export default () => {
    return {
        restrict: "A",
        scope: {
            expression: '&layoutViewInput',
            listenEvents: '=layoutViewEvents',
            propagateEvent: '=',
            cancelEvent: '='
        },
        link: (scope, element, attrs) => {
           const directiveNs = '.layoutviewinput';
            scope.$watchCollection(() => {
                return scope.listenEvents;
            }, (newVal, oldVal) => {
                const oldEvents = oldVal.map(oldListenEvents => {
                    return oldListenEvents + directiveNs;
                }).join(' ');
                const newEvents = newVal.map(newListenEvents => {
                    return newListenEvents + directiveNs;
                }).join(' ');

                if(angular.isArray(oldVal)) {
                    element.off(oldEvents);
                }
                if(angular.isArray(newVal)) {
                    element.on(newEvents, (e) => {
                        scope.$apply(() => {
                            scope.expression({ '$event': e });
                        });                
                        if(scope.propagateEvent) {
                            e.stopPropagation();
                        }
                        if(scope.cancelEvent) {
                            e.preventDefault();
                        }                    
                    });
                }
            });
            scope.$on('$destroy', () => {
                element.off(directiveNs);
            });
        }
    }
}


