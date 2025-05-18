const jwt=require("jsonwebtoken")
const config=require("../config.json");
function generateToken(payload) {
  return jwt.sign(payload,config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN || '1h'
  });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  console.log("Token"+token);
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token,config.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken
};