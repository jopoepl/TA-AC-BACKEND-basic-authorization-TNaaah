const User = require("../models/user")

module.exports = {
    loggedInAdmin: (req, res, next) => {
        if(req.session.type == "admin") {
            next()
        } else {
            req.flash("error", "You Need Admin Access To View This Page")
            res.redirect(`/admin/login`)
        }
    },
    blockedUser: (req, res, next) => {
        let userId = req.session.userId
        User.findOne({_id: userId},(err, user) => {
            if(user.blocked === true){
                req.flash("message", "You are blocked")
                res.redirect(`/user/login`)
            } else {
                next()
            }
        })
    }
}

