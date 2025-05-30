const express = require("express");
const router = express.Router();
const {
  voteForMovie,
  getAllVoteCounts,
  getVoteCountForMovie,
} = require("../controllers/voteController");
const auth = require("../middlewares/auth");

// Nouveau : tous les compteurs de vote
router.get("/counts", getAllVoteCounts);

// Nouveau : compteur pour un film spécifique
router.get("/:movieId", getVoteCountForMovie);

// Voter
router.post("/:movieId", auth, voteForMovie);

module.exports = router;
