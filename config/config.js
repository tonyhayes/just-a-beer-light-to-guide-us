export default function onConfig($provide, $httpProvider) {
 
     $httpProvider.defaults.headers.common["NG_X-Requested-With"] = 'XMLHttpRequest';
// FIXME - ask Carson    
//    $httpProvider.defaults.headers.common["NG_OWASP_CSRFTOKEN"] = emmFn.tokenFromSession();
    $httpProvider.interceptors.push('apiInterceptor');


}
onConfig.$inject = ['$provide', '$httpProvider'];