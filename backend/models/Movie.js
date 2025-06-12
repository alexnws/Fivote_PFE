const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    sparse: true, // Pour éviter les erreurs si id est absent (films manuels)
  },
  title: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  poster_path: {
    type: String,
    required: true,
  },
  summary: {
    type: String, // ✅ Ajoute ce champ pour la description
    default: "",
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Movie = mongoose.model("Movie", MovieSchema);
module.exports = Movie;
