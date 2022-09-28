var express = require('express');
var router = express.Router();
var User = require(`../models/user`)
var Comment = require(`../models/comment`)
var Auth = require(`../middleware/auth`)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect(`/articles`);
});


//handling SIGNUP

router.get('/signup', function(req, res, next) {
  res.render(`signup`);
});


router.post(`/signup`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return res.render(`error`, {message: "Client Error", error: err})
    req.flash(`message`, "User created successfully")
    res.redirect(`/users/login`)
  })
})

//handling LOGIN 

router.get(`/login`, (req, res, next) => {
    res.render(`login`)

  })
  


router.post(`/login`, (req, res, next) => {
    var {email, password} = req.body
    if(!email || !password){
      req.flash("message", "Email or Password cannot be empty")
      return res.redirect(`/users/login`, {message})
    }
    User.findOne({email: email},(err, user) => {
      if(err) return next(err) //no user
      console.log(user, "USER")
      if(!user){
        req.flash("message", "User not found")
        return res.redirect(`/users/login`)
      }
      user.verifyPassword(password, (err, result) => {
        if(!result) {
          if(err) next(err);
          req.flash("message", "Incorrect password")
          return res.redirect(`/users/login`)
        }
        if(err) next(err);
        req.session.userId = user._id
        req.session.name = user.fname
        res.locals.user = user.fname
        console.log("RES LOCALS", res.locals.user)
        if(user.article.length ===  0){
          console.log("EMPTY ARRAY CONDITION INVOKED")
          //checking if articles is empty
          res.render(`allArticles`, {articles: null, name: res.locals.user || null})
        } else {
          //if articles present, we are showing it on the sscreen
          res.redirect(`/articles`)


        // User.findOne({email: email}).populate(`article`).exec((err, user)=> {
        //     console.log(`AFTER POPULATE`)
        //     console.log(user, "USER")
        //     let articles = user.article
        //     res.render(`allArticles`, {articles: articles, name: res.locals.user || null})
        //   }) 
        }
      })
    })

  })


  // VIEWING USER's ARTICLES

  router.get(`/articles`, Auth.loggedInUser, (req, res, next)=> {
    User.findOne({fname: res.locals.user}).populate(`article`).exec((err, user)=> {
      let articles = user.article
      res.render(`allArticles`, {articles: articles, name: res.locals.user || null})
    }) 
  })

  //handling logout
  router.get(`/logout`, (req, res, next) => {
    req.session.destroy();
     res.render(`login`, {message: "Logout Successful"})
  })


  //handling comments

  // router.post(`/comment`, (req, res, next) => {
  //   Comment.create(req.body, (err, comment) => {
  //     if(err) console.log(err)
  //     res.render()
  //   })
  // })




module.exports = router;
