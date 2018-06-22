var mongoose = require("mongoose");

var ArticleSchema = new mongoose.Schema({
   title: String,
   image: String,
   imageId: String,
   imgSource: String,
   content: String,
   submittedAt: {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
        username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
      ]
   });

module.exports = mongoose.model("Article", ArticleSchema);