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
            superAdmin      : Boolean,
            hash            : String,
            salt            : String,
            blacklist       : Array,
            resetPasswordToken : String,
            resetPasswordExpires : Number,
            changeEmailExpires : Number,
            changeEmailToken    : String,
            tempEmail        : String
        });

userSchema.methods.setPassword = function (password, save) {
    password = String(password);

    console.log(password);

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    if (save) {
        this.save();
    }
};

userSchema.methods.validPassword = function (password) {
    password = String(password);

    console.log(password);

    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

    return this.hash === hash;
};

userSchema.methods.setAdmin = function (isSuperAdmin) {

    if (isSuperAdmin) {
        this.superAdmin = true;

        this.markModified('superAdmin');
    } else {
        this.admin = true;

        this.markModified('admin');
    }


    this.save();
};

userSchema.methods.removeAdmin = function () {
    this.admin = false;

    this.markModified('admin');

    this.save();
};

userSchema.methods.setBlacklist = function (bl) {
    this.blacklist = bl;

    this.markModified('blacklist');

    this.save();
};

userSchema.methods.setRestorePasswordData = function (token) {
    this.resetPasswordToken     = token;
    this.resetPasswordExpires   = Date.now() + 3600000;

    this.markModified('resetPasswordToken');
    this.markModified('resetPasswordExpires');

    this.save();
};

userSchema.methods.changeName = function (name) {
    this.name = name;

    this.markModified('name');

    this.save();
};

userSchema.methods.setNewEmail = function () {
    this.email = this.tempEmail;

    this.markModified('email');

    this.save();
};

userSchema.methods.generateJwt = function(addData = {}) {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    let options = {
        _id     : this._id,
        email   : this.email,
        name    : this.name,
        exp     : parseInt(expiry.getTime() / 1000),
        permissions: this.admin ? ['admin'] : ['user']
    };

    Object.assign(options, addData);

    return jwt.sign(options, process.env.JWTSecret);
};

mongoose.model('User', userSchema);