var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;
var slug = require(`slug`)


var articleSchema = new Schema({
    title: {type: String, minlength: 5, required: true},
    description: String,
    likes: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    author: {type: Schema.Types.ObjectId, required: true, ref: "User"},
    slug: {type: String, unique: true}
})


articleSchema.pre(`save`, function(next) {
    if(this.title && this.isModified(`title`)) {
        this.slug = slug(this.title)
        return next()
    }
})


module.exports = mongoose.model(`Article`, articleSchema)