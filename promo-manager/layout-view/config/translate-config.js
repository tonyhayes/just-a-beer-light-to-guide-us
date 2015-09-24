import labels from './labels-en_US.json!json';

export default function onConfig($provide, $translateProvider) {
    $translateProvider.translations('en', labels);
    $translateProvider.preferredLanguage('en');
}
onConfig.$inject = ['$provide', '$translateProvider'];

