var express = require("express");
var router  = express.Router({mergeParams: true});
var Article = require("../models/articles");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW COMMENTS
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find article by ID
    Article.findById(req.params.id, function(err, article){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {article: article});
        }
    })
});

//CREATE NEW COMMENTS

router.post("/",middleware.isLoggedIn, function(req,res){
    //look up article by ID
    Article.findById(req.params.id, function(err, article){
        if(err){
            console.log(err);
            res.redirect("/articles");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err); 
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    article.comments.push(comment);
                    article.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect('/articles/' + article._id);
                }
            });
        }
    });
});

//COMMENT EDIT ROUTE

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
              res.render("comments/edit", {article_id: req.params.id, comment: foundComment}); 
        }
    });
});

//COMMENT UPDATE ROUTE

router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/articles/" + req.params.id);
       }
   });
});

//COMMENT DELETE ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted");
             res.redirect("/articles/" + req.params.id);
        }
    });
});


module.exports = router;