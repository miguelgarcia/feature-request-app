import $ from 'jquery';

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

class Ajax {

    constructor(loadingIndicator, onAuthError) {
        this.loadingIndicator = loadingIndicator;
        this.onAuthError = onAuthError;
        $.ajaxSetup({
            beforeSend: (jqXHR, settings) => {
                jqXHR.setRequestHeader('x-api-token', getCookie('x-api-token'));
                this.loadingIndicator(this.loadingIndicator() + 1);
            },
            complete: (jqXHR, status) => {
                this.loadingIndicator(this.loadingIndicator() - 1);
                if (jqXHR.status == 401) {
                    this.onAuthError();
                }
            }
        });
        this.fetch = $.ajax;
    }
}

export default Ajax;