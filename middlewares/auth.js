const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next){
    const tokenCookie = req.cookies?.token;

    if(!tokenCookie)
        return next();

    const token = tokenCookie;

    const user = getUser(token);

    req.user = user;

    return next();
}

// admin , Normal

function restrictTo(roles = []){
    return function(req, res, next){
        if(!req.user) res.redirect("/login");

        if(!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    };
}


module.exports = {
    checkForAuthentication,
    restrictTo,
};