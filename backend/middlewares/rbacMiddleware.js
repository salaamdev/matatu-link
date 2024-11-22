// middlewares/rbacMiddleware.js
const rbacMiddleware = (allowedRoleIds) => {
    return (req, res, next) => {
        const userRoleId = req.user?.roleId; // This matches the token payload

        console.log(`User Role ID from Token: ${ userRoleId }`);
        console.log(`Allowed Role IDs for Route: ${ allowedRoleIds }`);

        if (!userRoleId || !allowedRoleIds.includes(userRoleId)) {
            return res.status(403).json({message: 'Access forbidden - Insufficient permissions'});
        }

        next();
    };
};

module.exports = rbacMiddleware;
