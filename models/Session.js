const mongoose = require('mongoose')

// Describe users collection
module.exports= mongoose.model('Session', new mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"user"}
}));