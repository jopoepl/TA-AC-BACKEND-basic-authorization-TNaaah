var express = require('express');
var router = express.Router();
var Article = require(`../models/article`);
var User = require(`../models/user`)
var Comment = require(`../models/comment`)
var Auth = require(`../middleware/auth`)

/* GET home page. */
router.get('/', function(req, res, next) {
    Article.find({}, (err, articles) => {
        if(err) next(err);
        console.log(req.session.name)
            res.render(`allArticles`, {articles: articles, name: req.session.name})

    })



        // User.findOne({fname: req.session.name}, (err, user) => {
        //     console.log(req.session.name, "sess name")
        //     console.log(user, "USER")
        // })
        
        // User.findOne({fname: req.session.name}).populate(`article`).exec((err, user)=> {
        //     console.log(user, "User Found using req sess")
        //     let articles = user.article
        //     console.log("ARTICLES", articles)
        //     res.render(`allArticles`, {articles: articles, name: req.session.name})
        // })
});

//ADDING AN ARTICLE

router.get('/add', Auth.loggedInUser, function(req, res, next) {
        let session = req.session
        res.render('addArticle', { session});
});



router.post('/add', Auth.loggedInUser, function(req, res, next) {

        Article.create(req.body, (err, article) => {
            if(err) next(err)
            console.log("ARticle Author", article.author)
            User.findOneAndUpdate({_id: article.author}, {$push: {article: article._id}}, (err, user) => {
                User.findOne({fname: user.fname}).populate(`article`).exec((err, user)=> {
                    let articles = user.article
                    res.render(`allArticles`, {articles: articles, name: req.session.name})
                })
            })
        })
});


//VIEWING SINGLE ARTICLE

router.get(`/:slug/`, function(req, res, next){
    let link = req.params.slug;
    Article.findOne({slug: link}).populate(`comments`).exec((err, article) => {
        if(err) console.log(err)
        res.render(`articles`, {article})
    })
})


//UPDATING AN ARTICLE

router.get(`/:slug/update`, Auth.loggedInUser, function(req, res, next){
    let link = req.params.slug;

    Article.findOne({slug: link}, (err, article) => {
        if(err) console.log(err)
        let authorId = req.session.userId
        if(article.author == authorId){
            res.render(`updateArticle`, {article: article, name: req.session.name})
        } else {
            res.redirect(`/articles/${link}`)
        }
        
    })
})

router.post(`/:slug/update`, Auth.loggedInUser, function(req, res, next){
    let link = req.params.slug;
    Article.findOneAndUpdate({slug: link}, req.body, (err, article) => {
        if(err) console.log(err)
        console.log("ARTICLE UPDATED", article)
        res.render(`articles`, {article})
    })
})

//DELETING AN ARTICLE

router.get(`/:slug/delete`, Auth.loggedInUser, function(req, res, next){
    let link = req.params.slug;
    Article.findOne({slug: link}, (err, article) => {
        if(err) console.log(err)
        let authorId = req.session.userId
        if(article.author == authorId){
    Article.findOneAndDelete({slug: link}, (err, article) => {
        if(err) console.log(err)
        console.log("ARTICLE DELETED", article)
        res.redirect(`/articles`)
    })
    } else{
        res.redirect(`/articles/${link}`)
    }  
})
})

//ADDING COMMENTS

// router.get(`/:slug/comment`, function(req, res, next){
//     res.render(`addComment`)
// })





router.post(`/:slug/comment`, Auth.loggedInUser,  function(req, res, next){
    req.body.author = req.session.userId
    Comment.create(req.body, (err, comment) => {
        if(err) console.log(err)
        let articleId = comment.article
        let commentId = comment._id 
        Article.findOneAndUpdate({_id: articleId}, {$push: {comments: commentId}}, (err, article) => {
            console.log("UPDATED ARTICLE", article)
            res.redirect(`/articles/${article.slug}`)
        })  
    })
})


//LIKING A COMMENT

router.get(`/comment/:id/like`, Auth.loggedInUser,  (req, res, next) => {
    let id = req.params.id;
    Comment.findOneAndUpdate({_id: id}, {$inc: {likes: 1}}).populate(`article`).exec((err, comment) => {
        res.redirect(`/articles/${comment.article.slug}`)
    })
})

//DISLIKING A COMMENT

router.get(`/comment/:id/dislike`, Auth.loggedInUser, (req, res, next) => {
    let id = req.params.id;
    Comment.findOneAndUpdate({_id: id}, {$inc: {dislikes: 1}}).populate(`article`).exec((err, comment) => {
        res.redirect(`/articles/${comment.article.slug}`)
    })
})



//DELETING A COMMENT
router.get(`/comment/:id/delete`, Auth.loggedInUser, (req, res, next) => {
    let id = req.params.id;
    let authorId = req.session.userId
    Comment.findById(id).exec((err, comment) => {
        if(comment.author == authorId){
            Comment.findOneAndDelete({_id: id}, (err, comment) => {
                let articleID = comment.article
                Article.findOneAndUpdate({_id: articleID}, {$pull: {comments: comment._id}}, (err, article) => {
                    if(err) next(err)
                    res.redirect(`/articles/${article.slug}`)
                })
            })
        } else {
            Comment.findOne({id}).populate("article").exec((err, comment)=> {
            req.flash("error", "You are not Authorized for this operation")
            res.redirect(`/articles/${comment.article.slug}`)

            })
            
        }

    })

})

// router.get






module.exports = router;
