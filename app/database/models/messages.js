const   mongoose            = require( 'mongoose' ),
        crypto              = require('crypto'),
        jwt                 = require('jsonwebtoken');

let     message          = new mongoose.Schema({
    text            : {
        type        : String,
        required    : true
    },
    subject         : {
        type        : String,
        required    : true
    },
    sender           : String,
    receivers        : String
});

message.method.setMessage = function (message, sender, receiver) {


    this.save();
};

message.methods.checkId = function () {

};

mongoose.model('Message', message);