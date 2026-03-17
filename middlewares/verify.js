exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // 1. Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user to request
    req.user = decoded;

    // 4. Continue
    next();
  } catch (err) {
    // 5. Handle errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(403).json({ message: "Invalid token" });
  }
};