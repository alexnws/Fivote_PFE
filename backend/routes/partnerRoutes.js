const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const isPartner = require("../middlewares/isPartner");

router.post("/", isPartner, async (req, res) => {
  const { title, year, posterUrl } = req.body;

  if (!title || !year || !posterUrl) {
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
router.delete("/:id", isPartner, async (req, res) => {
  const movieId = req.params.id;

  try {
    //Important : bien vérifier l'ID ET le propriétaire
    const deleted = await Movie.findOneAndDelete({
      _id: movieId,
      cinemaId: req.user.id, // pour éviter de supprimer les films des autres
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

module.exports = router;
