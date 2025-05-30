const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

//GET tous les films (utilisé dans page d’accueil)
router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error("❌ Erreur chargement films :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

//GET un film par ID (utilisé dans [id].tsx)
router.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Recherche film avec ID :", id); // 🐛 log de debug

  try {
    const movie = await Movie.findOne({ id: Number(id) });

    if (!movie) {
      console.log("❌ Film introuvable avec ID :", id);
      return res.status(404).json({ message: "Film introuvable" });
    }

    console.log("✅ Film trouvé :", movie);
    res.json(movie);
  } catch (err) {
    console.error("❌ Erreur récupération film :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
//GET /api/cinema-movies : films ajoutés par les partenaires
router.get("/cinema-movies", async (req, res) => {
  try {
    const partnerMovies = await Movie.find({ cinemaId: { $ne: null } });
    res.json(partnerMovies);
  } catch (err) {
    console.error("❌ Erreur récupération films partenaires :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
