
export default function onMockConfig($provide, $httpProvider) {
        $httpProvider.interceptors.push('layoutViewMockResponse');
}
onMockConfig.$inject = ['$provide', '$httpProvider'];