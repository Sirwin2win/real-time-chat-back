exports.verifyToken = (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // e.g. { id, role }
    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};