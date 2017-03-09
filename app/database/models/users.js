import mongoose from 'mongoose';
import crypto   from 'crypto';
import jwt      from 'jsonwebtoken';

let
    userSchema                  = new mongoose.Schema({
        email                   : {
            type                : String,
            unique              : true,
            required            : true
        },
        name                    : {
            type                : String,
            required            : true
        },
        password                : String,
        admin                   : Boolean,
        superAdmin              : Boolean,
        hash                    : String,
        salt                    : String,
        blacklist               : Array,
        resetPasswordToken      : String,
        resetPasswordExpires    : Number,
        changeEmailExpires      : Number,
        changeEmailToken        : String,
        tempEmail               : String
    });

userSchema.pre('save', function (next) {
    let user = this;

    //hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(String(user.password), this.salt, 1000, 64, 'sha512').toString('hex');

    delete user.password;

    return next();
});

userSchema.methods.validPassword = function (password) {
    let
        hash = crypto.pbkdf2Sync(String(password), this.salt, 1000, 64, 'sha512').toString('hex');

    return this.hash === hash;
};

userSchema.methods.setAdmin = function (isSuperAdmin) {

    if (isSuperAdmin) {

        this.superAdmin = true;
        this.markModified('superAdmin');
    }

    this.admin = true;
    this.markModified('admin');

    this.save();
};

userSchema.methods.removeAdmin = function () {
    this.admin = false;

    this.markModified('admin');

    this.save();
};

userSchema.methods.setBlacklist = function (blacklist) {
    this.blacklist = blacklist;

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

    this.tempEmail = null;

    this.save();
};

userSchema.methods.generateJwt = function(addData = {}) {
    let options,
        expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

    options             = {
        _id             : this._id,
        email           : this.email,
        name            : this.name,
        exp             : parseInt(expiry.getTime() / 1000),
        permissions     : this.admin ? ['admin'] : ['user']
    };

    Object.assign(options, addData);

    return jwt.sign(options, process.env.JWTSecret);
};

mongoose.model('User', userSchema);