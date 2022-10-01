var express = require('express');
const Podcast = require('../models/podcast');
const User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let id = req.session.userId
    let type = req.session.type
    if(req.session.type == "admin"){
        Podcast.find({}, (err, podcasts) => {
            console.log("ADMIN", podcasts)
            res.render(`podcastAll`, {podcasts: podcasts, type: type})
        })
    } else {
    User.find({_id: id}, (err, user) =>{
        console.log("USER", user, id)
        if(user[0].userType == "free"){
            Podcast.find({podcastType: {$eq: ["free"]}, status: "approved"}, (err, podcasts) => {
                console.log("FREE", podcasts)
                res.render(`podcastAll`, {podcasts: podcasts, type: type})
            })
        } else if(user[0].userType == "vip"){
            Podcast.find({podcastType: {$nin: [" premium"]}, status: "approved"}, (err, podcasts) => {
                console.log("VIP", podcasts)
                res.render(`podcastAll`, {podcasts: podcasts, type: type})
            })
        } else if(user[0].userType == "premium"){
            Podcast.find({podcastType: {$all: ["free"]}, status: "approved"}, (err, podcasts) => {
                console.log("PREM", podcasts)
                res.render(`podcastAll`, {podcasts: podcasts, type: type})
            })
        }
    })
}
//   Podcast.find({}, (err, podcasts) => {
//     if(err) next(err);
//     res.render("podcastAll", {podcasts})
//   })
});

/* CREATE PODCAST */

router.get('/create', function(req, res, next) {
    let type = req.session.type
    res.render(`podcastCreate`, {type})
});

router.post('/create', function(req, res, next) {
    
    req.body.podcastType = req.body.podcastType.split(`,`)
    if(req.session.type == "admin"){
        Podcast.create(req.body, (err, podcast) => {
            if(err) next(err)
            console.log("PODCAST", podcast)
            req.flash("message", "Published")
            res.redirect(`/podcast`)
        } )
    } else {
        req.body.status = "pending"
        Podcast.create(req.body, (err, podcast) => {
            if(err) next(err)
            req.flash("message", "Your Podcast Is Under Review")
            res.redirect(`/podcast`)
        } )

    }

});


/* VIEW SINGLE PODCAST */

router.get(`/:id`, (req, res, next) => {
    let id = req.params.id
    Podcast.findOne({_id: id}, (err, podcast) => {
        if(err) next(err)
        res.render(`podcastSingle`, {podcast: podcast, userType:req.session.type})
    })
})

/* APPROVE SINGLE PODCAST */

router.get(`/:id/approve`, (req, res, next) => {
    let id = req.params.id
    Podcast.findOneAndUpdate({_id: id}, {status: "approved"}, (err, podcast) => {
        if(err) next(err)
        res.redirect(`/podcast`)
    })
})

/* DELETE SINGLE PODCAST */

router.get(`/:id/delete`, (req, res, next) => {
    let id = req.params.id
    Podcast.findOneAndDelete({_id: id}, (err, podcast) => {
        if(err) next(err)
        res.redirect(`/podcast`)
    })
})




module.exports = router;
