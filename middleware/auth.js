// Session Authentication Check Middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
}

// Role-Based Access Control (RBAC) Middleware
function hasRole(...roles) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        if (roles.includes(req.session.user.role) || req.session.user.role === 'SuperAdmin') {
            return next();
        }
        res.status(403).render('error', { 
            message: 'Access Denied: You do not have permission to view this resource.' 
        });
    };
}

module.exports = {
    isAuthenticated,
    hasRole
};
