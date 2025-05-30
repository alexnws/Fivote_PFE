require("dotenv").config();
const mongoose = require("mongoose");

console.log("🔍 Test de connexion à MongoDB...");
console.log("URI utilisée :", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connexion MongoDB réussie"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));
