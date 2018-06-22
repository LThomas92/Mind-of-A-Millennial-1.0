var Article = require("../models/articles");
var Comment = require("../models/comment");
var User    = require("../models/user");

var middlewareObj = {};

middlewareObj.isAdmin = function(req,res,next){
    if(req.isAuthenticated() && req.user.Admin){
        return next();
    }
    req.flash("error", "You do not have permission to do that");
    res.redirect("back");
}

middlewareObj.isWriter = function(req,res,next){
    if(req.isAuthenticated() && req.user.isWriter){
        return next();
    }
    req.flash("error", "You do not have permission to do that");
    res.redirect("back");
}

middlewareObj.checkArticleOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Article.findById(req.params.id, function(err, foundArticle){
           if(err){
               req.flash("error", "Article not found");
               res.redirect("back");
           }  else {
               // does user own article?
            if(foundArticle.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You need to be logged in to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;