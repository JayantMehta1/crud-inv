const mongoose = require('mongoose');

var recentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    quantity: {
        type: String
    },
    comments: {
        type: String
    }
});

mongoose.model('Recent', recentSchema)