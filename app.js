//config dot env
require('dotenv/config');
var express               = require("express");
var mongoose              = require("mongoose");
var bodyParser            = require("body-parser");
var moment                = require("moment");
var flash                 = require("connect-flash");
var methodOverride        = require("method-override");
var nodemailer            = require("nodemailer");
var passport              = require("passport");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var http                  = require('http');
var enforce               = require('express-sslify');
var User                  = require("./models/user");
var Article               = require("./models/articles");
var Comment               = require("./models/comment");


var app = express();

//requiring routes
var indexRoutes        = require("./routes/index");
var articleRoutes      = require("./routes/articles");
var commentRoutes      = require("./routes/comment");
var aboutRoutes        = require("./routes/about");
var contactRoutes      = require("./routes/contact");


//MIDDLEWARE
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.use(enforce.HTTPS({ trustProtoHeader: true }))

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "Mind of A Millennial",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   app.locals.moment      = require('moment');
   next();
});

app.use("/", indexRoutes);
app.use("/articles", articleRoutes);
app.use("/articles/:id/comments", commentRoutes);
app.use("/about", aboutRoutes);
app.use("/contact", contactRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING");
});