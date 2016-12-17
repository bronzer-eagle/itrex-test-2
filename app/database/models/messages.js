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

message.methods.readMessage = function (userEmail) {
    this.receivers.findIndex = function (name, value) {
        for (let i = 0; i < this.length; i++) {
            if (this[i][name] == value) return i;
        }
        return false;
    };

    let i = this.receivers.findIndex('email', userEmail);

    this.receivers[i].is_read = true;

    this.markModified('receivers');

    this.save();
};

mongoose.model('Message', message);