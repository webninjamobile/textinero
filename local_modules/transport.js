var Client = require('node-rest-client').Client,
    queryString = require('querystring'),
    _this = this;

var client = new Client();
var makeid = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var chikkaAPI = {
    shortcode: process.env.CHIKKA_SHORTCODE,
    client_id: process.env.CHIKKA_ID,
    secret_key: process.env.CHIKKA_SECRET
}

/*
 for replying only
 */

exports.chikkaReply = function (mobile_number, message, callback) {
    chikkaAPI.message_type = 'REPLY';
    chikkaAPI.request_cost = 'FREE',
        chikkaAPI.mobile_number = mobile_number;
    chikkaAPI.message_id = makeid();
    chikkaAPI.request_id = data.request_id;
    chikkaAPI.message = message;
    var args = {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: queryString.stringify(chikkaAPI),
        parameters: chikkaAPI
    };
    //Log.info("chikka reply "+ message);
    client.post(process.env.CHIKKA_GATEWAY, args, function (data, response) {
        callback(data);
    });
}

/*
 for replying only
 */

exports.chikkaSend = function (mobile_number, message, callback) {
    chikkaAPI.message_type = 'SEND';
    chikkaAPI.mobile_number = mobile_number;
    chikkaAPI.message_id = makeid();
    chikkaAPI.message = message;
    var args = {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: queryString.stringify(chikkaAPI),
        parameters: chikkaAPI
    };

    client.post(process.env.CHIKKA_GATEWAY, args, function (data, response) {
        // parsed response body as js object
        callback(data,response);
    });

}
