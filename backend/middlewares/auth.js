// Importe la bibliothèque jsonwebtoken pour gérer les tokens JWT (vérification, génération, décodage)
const jwt = require("jsonwebtoken");

// Charge les variables d'environnement (comme JWT_SECRET) depuis un fichier .env
require("dotenv").config();

// Middleware de vérification du token JWT pour protéger les routes privées
const verifyToken = (req, res, next) => {
  // Récupère l'en-tête d'autorisation (Authorization) envoyé par le client
  const authHeader = req.headers.authorization;

  // Vérifie si l'en-tête est présent et commence bien par "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Si l'en-tête est manquant ou incorrect, renvoie une erreur 401 (non autorisé)
    return res.status(401).json({ message: "Accès non autorisé" });
  }

  // Récupère uniquement le token en supprimant le "Bearer " au début
  const token = authHeader.split(" ")[1];

  try {
    // Vérifie la validité du token avec la clé secrète stockée dans .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Si le token est valide, on stocke les infos décodées dans req.user
    // (ex : l'id de l'utilisateur pour l'utiliser plus tard dans la route)
    req.user = decoded;

    // Passe à la suite (route ou middleware suivant)
    next();
  } catch (error) {
    // Si le token est invalide ou expiré, on renvoie une erreur 403 (interdit)
    return res.status(403).json({ message: "Token invalide" });
  }
};

// Exporte le middleware pour l'utiliser dans d'autres fichiers (ex: routes protégées)
module.exports = verifyToken;
