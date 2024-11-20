const rbacMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Get user role from the JWT token set by authMiddleware
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({message: 'Access forbidden - Insufficient permissions'});
        }

        next();
    };
};

module.exports = rbacMiddleware;