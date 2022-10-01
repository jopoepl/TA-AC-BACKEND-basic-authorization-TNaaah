var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;



var podcastSchema = new Schema({
    name: {type: String, required: true},
    podcastType: [{type: String, required: true}],
    status: {type: String, default: "approved"}
})




module.exports = mongoose.model(`Podcast`, podcastSchema)