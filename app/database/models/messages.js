const   _                   = require('underscore'),
        mongoose            = require( 'mongoose' ),
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
    receivers        : [{receiver: {ref: 'User', type: String}, is_read: Boolean}],
    date             : { type: Date, default: Date.now },
    attachment       : Object
});

message.methods.readMessage = function (userId) {
    let obj = _.findWhere(this.receivers, {receiver: userId});

    obj.is_read = true;

    this.markModified('receivers');

    this.save();
};

mongoose.model('Message', message);