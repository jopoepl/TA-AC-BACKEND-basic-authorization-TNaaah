var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;



var commentSchema = new Schema({
    content: String,
    article: {type: Schema.Types.ObjectId, ref: "Article"},
    author: {type: Schema.Types.ObjectId, ref: "User"},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0}
})



module.exports = mongoose.model(`Comment`, commentSchema)