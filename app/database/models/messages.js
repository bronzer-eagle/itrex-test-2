const   mongoose            = require( 'mongoose' ),
        crypto              = require('crypto'),
        jwt                 = require('jsonwebtoken');

let     message          = new mongoose.Schema({
    body           : {
        type        : String,
        required    : true
    },
    subject         : {
        type        : String,
        required    : true
    },
    sender           : String,
    receiver         : String,
    salt            : String
});

message.method.setMessage = function (message, sender, receiver) {


    this.save();
};

message.methods.checkId = function () {

};

mongoose.model('Message', message);