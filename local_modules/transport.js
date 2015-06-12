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

exports.chikkaReply = function (data, message, callback) {
    chikkaAPI.message_type = 'REPLY';
    chikkaAPI.request_cost = 'FREE',
        chikkaAPI.mobile_number = data.mobile_number;
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

exports.chikkaSend = function (data, message, callback) {
    chikkaAPI.message_type = 'SEND';
    chikkaAPI.mobile_number = data.mobile_number;
    chikkaAPI.message_id = makeid();
    chikkaAPI.message = message;
    var args = {
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: queryString.stringify(chikkaAPI),
        parameters: chikkaAPI
    };
    Log.info("chikka send "+ message);
    client.post(process.env.CHIKKA_GATEWAY, args, function (data, response) {
        // parsed response body as js object
        callback(data);
    });

}

exports.send = function(data,callback){
    var gateway = data.gateway || 'sun';
    //console.log(data);
    _this[gateway](data,callback);

}

exports.sun = function (data, callback) {
    var message = data.message;
    var apiData = {
        user : process.env.SUN_USERNAME,
        pass : process.env.SUN_PASSWORD,
        to : data.numbers.toString(),//nexmo alternative
        from : data.user.username.toUpperCase(),
        msg : message
    };

    var str = process.env.SUN_GATEWAY+queryString.stringify(apiData);
    // console.log(str);
    _this.sendSMS(str,data,callback);

}

exports.sendSMS = function(url,data,callback){
    //console.log(url);
    client.get(url, function (curlData, response) {
        try{
            console.log(curlData);
            callback(data,'done', {done:curlData});
        }catch(err){
            //requeue
            Log.info('failed: something went wrong on the request',err);
            callback(data,'queued',{error:{failed:curlData}});
        }

    }).on('error',function(err){
        callback(data,'queued', {error: 'error : something went wrong on the request due to gateway errors.'});
        Log.info('error : something went wrong on the request due to gateway errors.', err.request.options);
    });;


}
