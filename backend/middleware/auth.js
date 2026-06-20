const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' }); // 401 Unauthorized
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid or expired' }); // 401 Unauthorized
    }
};