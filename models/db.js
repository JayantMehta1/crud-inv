var mongoose = require('mongoose');

var URI = "mongodb+srv://crud:abcd@cluster0.jkz5k.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URI)
.then(()=>console.log('DB CONNECTED'))
.catch(err=>console.log(err.message))

require('./item.model');
require('./recent.model');



