const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
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
