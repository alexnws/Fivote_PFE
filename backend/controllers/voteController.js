const Vote = require("../models/Vote");
const Movie = require("../models/Movie");

// GET : tous les compteurs
exports.getAllVoteCounts = async (req, res) => {
  try {
    const votes = await Vote.aggregate([
      { $group: { _id: "$movieId", count: { $sum: 1 } } },
    ]);

    const result = {};
    votes.forEach((v) => {
      result[v._id] = v.count;
    });

    res.json(result);
  } catch (err) {
    console.error("Erreur getAllVoteCounts :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// GET : compteur d’un seul film
exports.getVoteCountForMovie = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const count = await Vote.countDocuments({ movieId });
    res.json({ voteCount: count });
  } catch (err) {
    console.error("Erreur getVoteCountForMovie :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// POST : vote pour un film
exports.voteForMovie = async (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.movieId;

  try {
    const existingVote = await Vote.findOne({ userId, movieId });
    if (existingVote) {
      return res.status(400).json({ message: "Vous avez déjà voté." });
    }

    const newVote = new Vote({ userId, movieId });
    await newVote.save();

    // Si c’est un film local, on incrémente aussi voteCount
    await Movie.findOneAndUpdate(
      { id: Number(movieId) },
      { $inc: { voteCount: 1 } }
    );

    res.status(201).json({ message: "Vote enregistré" });
  } catch (err) {
    console.error("Erreur vote :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
