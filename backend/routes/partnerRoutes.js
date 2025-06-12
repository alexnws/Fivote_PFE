const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const isPartner = require("../middlewares/isPartner");

// Ajouter un film
router.post("/", isPartner, async (req, res) => {
  const { title, year, posterUrl, summary } = req.body;

  if (!title || !year || !posterUrl || !summary) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs" });
  }

  try {
    // Génère un ID numérique unique
    const id = Date.now() + Math.floor(Math.random() * 1000);

    const movie = new Movie({
      id,
      title,
      release_date: `${year}-01-01`,
      poster_path: posterUrl,
      summary,
      voteCount: 0,
      cinemaId: req.user.id,
    });

    await movie.save();
    res.status(201).json({ message: "Film ajouté", movie });
  } catch (err) {
    console.error("❌ Erreur ajout film :", err);
    res.status(500).json({ message: "Erreur lors de l’ajout" });
  }
});

// Récupérer les films du partenaire
router.get("/", isPartner, async (req, res) => {
  try {
    const partnerId = req.user.id;
    const movies = await Movie.find({ cinemaId: partnerId });
    res.json(movies);
  } catch (err) {
    console.error("❌ Erreur récupération films partenaire :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un film
router.delete("/:id", isPartner, async (req, res) => {
  const movieId = req.params.id;

  try {
    const deleted = await Movie.findOneAndDelete({
      _id: movieId,
      cinemaId: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Film non trouvé ou non autorisé" });
    }

    res.json({ message: "Film supprimé" });
  } catch (err) {
    console.error("❌ Erreur suppression film :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Modifier un film
router.put("/:id", isPartner, async (req, res) => {
  const movieId = req.params.id;
  const { title, year, posterUrl, summary } = req.body;

  if (!title || !year || !posterUrl || !summary) {
    return res
      .status(400)
      .json({ message: "Veuillez remplir tous les champs" });
  }

  try {
    const updated = await Movie.findOneAndUpdate(
      {
        _id: movieId,
        cinemaId: req.user.id,
      },
      {
        title,
        release_date: `${year}-01-01`,
        poster_path: posterUrl,
        summary,
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Film non trouvé ou non autorisé" });
    }

    res.json({ message: "Film modifié", movie: updated });
  } catch (err) {
    console.error("❌ Erreur modification film :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
