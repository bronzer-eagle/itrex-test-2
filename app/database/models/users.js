const   mongoose            = require( 'mongoose' ),
        crypto              = require('crypto'),
        jwt                 = require('jsonwebtoken');

let     userSchema          = new mongoose.Schema({
            email           : {
                type        : String,
                unique      : true,
                required    : true
            },
            name            : {
                type        : String,
                required    : true
            },
            admin           : Boolean,
            hash            : String,
            salt            : String,
            resetPasswordToken : String,
            resetPasswordExpires : String
        });

userSchema.methods.setPassword = function (password) {
    password = String(password);

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    this.save();
};

userSchema.methods.validPassword = function (password) {
    password = String(password);

    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id     : this._id,
        email   : this.email,
        name    : this.name,
        exp     : parseInt(expiry.getTime() / 1000),
    }, process.env.JWTSecret);
};

mongoose.model('User', userSchema);