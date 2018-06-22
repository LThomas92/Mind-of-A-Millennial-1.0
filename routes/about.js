var express = require("express");
var router = express.Router();
var Article = require("../models/articles");

//INDEX ROUTE
router.get("/", function(req, res){
    res.render("about/index");
});

//SHOW PROFILES =====================================//
 
//SHOW PAGE -- Show profiles
router.get("/ayannasoleil", function(req, res){
    Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, asarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-AS", {asarticles:asarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/nomascus", function(req, res){
  Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, bgarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-BG", {bgarticles:bgarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/ralphieblack", function(req, res){
 Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, ctarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-CT", {ctarticles:ctarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/gindiesel", function(req, res){
  Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, dparticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-DP", {dparticles:dparticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/hotshot", function(req, res){
   Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, ebarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-EB", {ebarticles:ebarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/law92", function(req, res){
   Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, ltarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-LT", {ltarticles:ltarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/bachi", function(req, res){
   Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, rcarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-RC", {rcarticles:rcarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/tbent92", function(req, res){
   Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, tbarticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-TB", {tbarticles:tbarticles});
        }
    });
});

//SHOW PAGE -- Show profiles
router.get("/wackodestroyer", function(req, res){
   Article.find({"author.id": "5b2c37e0fc01a522683b6027"}, function(err, kharticles){
        if(err) {
            console.log(err);
        } else {
        res.render("about/show-KH", {kharticles:kharticles});
        }
    });
});


module.exports = router;