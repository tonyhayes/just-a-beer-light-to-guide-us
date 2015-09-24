toggleState.$inject = [ '$document', '$parse' ];
function toggleState($document, $parse) {
    let serialNum = 0;
    return {
        link: ($scope, $ele, $attr) => {
            // Make sure we can differentiate between different instances
            // of the directive so we can cleanly create/destroy them
            const namespace = '.toggleState' + ++serialNum;

            // Per-instance state
            let isOpen = false;
            let inProgress = false;

            // On a click bubbling up to the document, clear the toggle
            // state IF it is marked as a unique toggleable and also
            // did not originate from the element
            $document.on('click' + namespace, () => {
                if($parse($attr.toggleUnique)($scope) && !inProgress) {
                    isOpen = false;
                    $scope.$digest();
                }
                inProgress = false;
            });

            // On a click, toggle the state but raise a flag so
            // the document click handler silently ignores it
            $ele.on('click' + namespace, ($event) => {
                isOpen = !isOpen;
                inProgress = true;
                $scope.$digest();
            });

            // On an update of the toggle state, write the
            // value back to the lval expression
            $scope.$watch(() => {
                return isOpen;
            }, (newVal, oldVal) => {
                $parse($attr.toggleState).assign($scope, newVal);
            });

            // Remember to clean up our event handlers
            $scope.$on('$destroy', () => {
                $ele.off('click' + namespace);
                $document.off('click' + namespace);
            });
        }
    }
}

export default toggleState;