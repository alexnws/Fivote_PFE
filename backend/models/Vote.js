const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

VoteSchema.index({ userId: 1, movieId: 1 }, { unique: true }); // empêche les doublons

module.exports = mongoose.model("Vote", VoteSchema);
