const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription d'un utilisateur
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification email valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    // Vérifier si l'email est déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    // Création de l'utilisateur
    const newUser = new User({ email, password });
    await newUser.save();

    console.log(`✅ New user created: ${email}`);
    res.status(201).json({ message: "Votre compte a été créé avec succès" });
  } catch (error) {
    console.error("❌ Erreur d'inscription :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Token incluant email
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token généré avec email :", jwt.decode(token));

    res.status(200).json({
      message: "Connexion réussie",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};
