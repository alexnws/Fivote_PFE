const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Vous devez être connecté en tant qu’admin" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé (non admin)" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Erreur de token admin :", error);
    return res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = isAdmin;
