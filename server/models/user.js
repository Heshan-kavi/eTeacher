const mongoose = require('mongoose')

/**
 * Data model for User.
 */

const Schema = mongoose.Schema
const userSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        createIndex: true,
        required: true,
        auto: true
    },
    name : {type : String},
    age : {type : Number},
    teacherFlag : {type : Boolean, auto : true},
    studentFlag : {type : Boolean, auto : true}

})
module.exports = mongoose.model('User', userSchema)
=======
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const crypto =require('crypto')
const schema = mongoose.Schema;

const userSchema = new schema({
    name: { type: String, require: true },
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    teacherFlag:Boolean,
    studentFlag:Boolean
    teacherFlag:{ type:Boolean,require:true},
    studentFlag:{type:Boolean,require:true}


});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 8000,
    secure: false,
    auth: {
        user: "ycr4602@gmail.com", //generated by Mailtrap
        pass: "20154602", //generated by Mailtrap
    }
});


const User = module.exports = mongoose.model("User", userSchema);

module.exports.saveUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;

            if (err) throw err;
            newUser.save(callback);
        });
    });
};

module.exports.createHash = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            password = hash;

            if (err) throw err;
            if (hash) {
                callback(null, hash);
            }
        });
    });
};

module.exports.findByEmail = function(email, callback) {
    const query = { email: email };
    User.findOne(query, callback)
}

module.exports.passwordCheck = function(plainpassword, hash, callback) {
    bcrypt.compare(plainpassword, hash, function(err, res) {
        if (err) { throw err };
        if (res) {
            callback(null, res);
        }
        console.log(err)
    });

}
// const token=crypto.randomBytes(20).toLocaleString('hex')
// user.update({
//     resetPasswordToken:token,
//     resetPasswordExpires:Date.now + 36000,
// })
module.exports.sendEmail = function(email, callback) {
    const link = "http://localhost:4200/updatepassword?email="+email;
    const mailOptions = {
        from: 'ycr4602@gmail.com',
        to: email,
        subject: 'Reset Password',
        html: "<h3>Reset Password</h3><h5>Click the following link to reset password</h5>" + email +  " <br>" +"<a href="+link+">reset link</a>"
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.findUserbyId = function(id, callback) {
    User.findOne(id, callback);
}