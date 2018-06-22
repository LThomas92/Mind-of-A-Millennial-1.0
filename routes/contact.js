var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");


// --> NEW CONTACT FORM

//NEW --> show form to create new article
router.get("/new", function(req, res){
        res.render("contact/new");
});

//-->POST route from contact form
router.post('/', function (req, res) {
  var mailOpts, smtpTrans;
  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'mofamillennial@gmail.com',
      pass: process.env.GMAILPW
    }
  });
  mailOpts = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;',
    to: 'mofamillennial@gmail.com',
    subject: 'New message from Mind of Millennial',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
       req.flash("error", "Something went wrong");
    }
    else {
      res.render('contact/confirm');
    }
  });
});


module.exports=router;