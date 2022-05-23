const mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
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

mongoose.model('Item', itemSchema)