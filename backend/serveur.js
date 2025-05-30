require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db"); // Import de la connexion MongoDB

// Connexion à MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth", require("./routes/authRoutes"));

// Port du serveur
const PORT = process.env.PORT || 5001;
app.get("/", (req, res) => {
  res.send("Serveur et MongoDB fonctionnent !");
});

app.listen(PORT, () => {
  console.log(`Serveur en ligne surhttp://192.168.1.15:${PORT}`);
});
// Routes liées aux votes (ajout de vote, vérification, etc.)
const voteRoutes = require("./routes/voteRoutes");
app.use("/api/votes", voteRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
const movieRoutes = require("./routes/movieRoutes");
app.use("/api", movieRoutes);
const partnerRoutes = require("./routes/partnerRoutes");
app.use("/api/my-cinema", partnerRoutes);
