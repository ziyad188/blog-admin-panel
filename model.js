var mongoose = require('mongoose');
  
var PostSchema = new mongoose.Schema({
    title: String,
    date: Date,
    name: String,
    tagline: String,
    content: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});
  
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('post', PostSchema);