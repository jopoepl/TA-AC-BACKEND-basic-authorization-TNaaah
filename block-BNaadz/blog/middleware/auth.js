var Comment = require(`../models/comment`)
var User = require(`../models/user`)
module.exports = {
    loggedInUser: (req,res, next) => {
        if(req.session && req.session.userId){
            next()
        } else {
            res.redirect(`/users/login`)
        }
    },
    // checkCommentUser: (req,res, next) => {
    //     Comment.findById({_id: id})


    // },
    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId;
        if(userId){
            user.findById(userId, "name email", (err, user) => {
                req.user = user;
                res.locals.user = user;
                next()
            })
        } else {
            req.user = null;
            res.locals.user = null;
            next()
        }
    }

}