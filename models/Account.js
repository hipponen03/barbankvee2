const mongoose = require('mongoose')

//Describe account collections
module.exports = mongoose.model('Account', new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"user", required:true, minlength:2,maxlength:50},
    account_number: {type: String, required:true, unique: true, minlength:8, maxlength:12},
    currency: {type: String, required:true, maxlength:20},
    balance: {type: Number, required:true, maxlength:15},
    name: {type: String, required:true, maxlength:50},
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
}));