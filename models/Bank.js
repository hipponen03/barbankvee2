const mongoose = require('mongoose')

//Describe banks collection
module.exports = mongoose.model('Bank', new mongoose.Schema({
    name: {type: String, required: true},
    transactionUrl: {type: String, required: true},
    bankPrefix: {type: String, required: true},
    owners: {type: String, required: true},
    jwksUrl: {type: String, required: true}
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
}));