import _        from 'underscore';
import mongoose from 'mongoose';

let
    message                 = new mongoose.Schema({
        text                : {
            type            : String,
            required        : true
        },
        subject             : {
            type            : String,
            required        : true
        },
        sender              : { type: String, ref: 'User' },
        senderName          : String,
        receivers           : [{receiver: {ref: 'User', type: String}, is_read: Boolean}],
        date                : Date,
        attachment          : Object
    });

message.methods.readMessage = function (userId) {
    let
        obj = _.findWhere(this.receivers, {receiver: userId});

    obj.is_read = true;

    this.markModified('receivers');

    this.save();
};

mongoose.model('Message', message);