import jwt from 'jsonwebtoken'

export const protect = async (req, res, next) => {
  let token = req.headers.authorization || res.cookies;
  if (token && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}


