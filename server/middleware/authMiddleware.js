const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    
    const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7, authHeader.length) 
        : authHeader;
    
    if (!token) return res.status(401).json({ message: "No token provided" });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};