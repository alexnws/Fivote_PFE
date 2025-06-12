// routes/movies.js
const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// GET tous les films (page d’accueil)
router.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    console.error("❌ Erreur chargement films :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET un film par ID (page de détail [id].tsx)
router.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Recherche film avec ID :", id);

  try {
    let movie = null;

    if (id.length === 24) {
      movie = await Movie.findById(id);
    }

    if (!movie) {
      movie = await Movie.findOne({ id: isNaN(id) ? id : Number(id) });
    }

    if (!movie) {
      return res.status(404).json({ message: "Film introuvable" });
    }

    const formatted = {
      id: movie.id || movie._id,
      title: movie.title || "Titre inconnu",
      overview: movie.overview || "", // de TMDB
      summary: movie.summary || "", // de ta base (admin/partner)
      release_date:
        movie.release_date ||
        (movie.year ? `${movie.year}-01-01` : "0000-01-01"),
      poster_path: movie.poster_path || movie.posterUrl || null,
      voteCount: typeof movie.voteCount === "number" ? movie.voteCount : 0,
    };

    console.log("✅ Film trouvé :", formatted);
    res.json(formatted);
  } catch (err) {
    console.error("❌ Erreur récupération film :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET tous les films ajoutés par les partenaires
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
