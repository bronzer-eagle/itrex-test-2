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
    sender           : { type: String, ref: 'User' },
    receivers        : Array,
    date             : { type: Date, default: Date.now },
    attachment       : Object
});

message.methods.checkId = function () {

};

mongoose.model('Message', message);