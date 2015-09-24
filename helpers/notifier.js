//import toastr from 'toastr/toastr';
//import 'toastr/toastr.css!';
export default class Notifier {
    constructor($translate) {        
        // toastr.options = {
        //         "closeButton": false,
        //         "debug": false,
        //         "positionClass": "toast-bottom-right",
        //         "onclick": null,
        //         "showDuration": "1000",
        //         "hideDuration": "1000",
        //         "timeOut": "5000",
        //         "extendedTimeOut": "1000",
        //         "showEasing": "swing",
        //         "hideEasing": "linear",
        //         "showMethod": "fadeIn",
        //         "hideMethod": "fadeOut"
        // };
//        this.toastr = toastr;
        this.$translate = $translate;
    }
    notify( body, title, severity ) {
//        this.toastr[severity || 'info']( body, title );
console.log(title+ ' '+ body)
    }
    errorWith(message){
//        this.toastr['error']( this.$translate.instant(message) );
console.log(this.$translate.instant(message))
        
    }
    error(message){
//        this.toastr['error']( this.$translate.instant(message) );        
console.log(this.$translate.instant(message))
    }
    info(message){
//        this.toastr['info']( this.$translate.instant(message)  );        
console.log(this.$translate.instant(message))
    }
    warn(message){
//        this.toastr['warning']( this.$translate.instant(message)  );        
console.log(this.$translate.instant(message))
    }
}
