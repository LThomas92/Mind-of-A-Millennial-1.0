var express = require("express");
var router  = express.Router({mergeParams: true});
var Article = require("../models/articles");
var User    = require("../models/user");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are accepted!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: "lthomas92", 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//INDEX --> SHOW ALL ARTICLES
router.get("/", function (req, res) {
    var perPage = 16;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    Article.find({}).sort({_id:-1}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allArticles) {
        Article.count().exec(function (err, count) {
            if (err) {
                console.log(err);
            } else {
                res.render("articles/index", {
                    articles: allArticles,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            }
        });
    });
});



//CREATE --> add a new article to DB
router.post("/", middleware.isLoggedIn, middleware.isWriter, upload.single('image'), function(req, res) {
 cloudinary.v2.uploader.upload(req.file.path, function(err, result) {
      if(err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      // add cloudinary url for the image to the article object under image property
      req.body.article.image = result.secure_url;
      var imgSource = req.body.article.imgSource;
      // add image's public_id to article object
      req.body.article.imageId = result.public_id;
      // add author to article
      req.body.article.author = {
        id: req.user._id,
        username: req.user.username
      }
      Article.create(req.body.article, function(err, article) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/articles/' + article.id);
      });
    });
});


//NEW - show form to create new article
router.get("/new", middleware.isLoggedIn, middleware.isWriter, function(req, res){
   res.render("articles/new"); 
});

// SHOW - shows full article
router.get("/:id", function(req, res){
    //find the article with provided ID
    Article.findById(req.params.id).populate("comments").exec(function(err, foundArticle){
        if(err){
            console.log(err);
        } else {
            console.log(foundArticle)
            //render show template with that article
            res.render("articles/show", {article: foundArticle});
        }
    });
});

router.get("/:id/edit", middleware.checkArticleOwnership, function(req, res){
    //find the article with provided ID
    Article.findById(req.params.id, function(err, foundArticle){
        if(err){
            console.log(err);
        } else {
            //render show template with that article
            res.render("articles/edit", {article: foundArticle});
        }
    });
});

router.put("/:id", upload.single('image'), function(req, res){
        Article.findById(req.params.id, async function(err, article){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(article.imageId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  article.imageId = result.public_id;
                  article.image = result.secure_url;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            article.name = req.body.name;
            article.imgSource = req.body.imgSource
            article.content = req.body.content;
            article.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/articles/" + article._id);
        }
    });
});

router.delete('/:id', function(req, res) {
  Article.findById(req.params.id, async function(err, article) {
    if(err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    try {
        await cloudinary.v2.uploader.destroy(article.imageId);
        article.remove();
        req.flash('success', 'Article deleted successfully!');
        res.redirect('/articles');
    } catch(err) {
        if(err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
    }
  });
});


module.exports = router;