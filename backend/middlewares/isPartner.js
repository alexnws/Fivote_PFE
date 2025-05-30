const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non autorisé (pas de token)" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "cinemaPartner") {
      return res.status(403).json({ message: "Accès réservé aux partenaires" });
    }

    req.user = decoded; // contient { id, role }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token invalide" });
  }
};
