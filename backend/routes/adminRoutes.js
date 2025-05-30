const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/isAdmin");
const Movie = require("../models/Movie");

// ✅ POST pour ajouter un film en base
router.post("/movies", isAdmin, async (req, res) => {
  const { title, year, posterUrl } = req.body;

  if (!title || !year || !posterUrl) {
    return res
      .status(400)
      .json({ message: "Veuillez renseigner tous les champs." });
  }

  try {
    const existing = await Movie.findOne({ title });
    if (existing) {
      return res.status(409).json({ message: "Ce film existe déjà." });
    }

    const newMovie = new Movie({
      id: Math.floor(Math.random() * 1000000), // ID unique
      title,
      release_date: `${year}-01-01`,
      poster_path: posterUrl,
    });

    await newMovie.save();

    res.status(201).json({ message: "Film créé", id: newMovie.id });
  } catch (err) {
    console.error("❌ Erreur ajout film :", err);
    res.status(500).json({ message: "Erreur lors de la création" });
  }
});
router.get("/", isAdmin, (req, res) => {
  res.json({ message: "Bienvenue dans l’espace admin" });
});

module.exports = router;
