import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { RegisterScreen as styles } from "../../styles/RegisterScreen";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  // États pour stocker les champs du formulaire
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [confirmMdp, setConfirmMdp] = useState("");

  // États pour la validation des champs
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isNavigating, setIsNavigating] = useState(false); // Pour éviter les doubles clics
  const [showPassword, setShowPassword] = useState(false); // Affichage du mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter(); // Pour la navigation entre les pages

  // Vérifie que l'email a un bon format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Vérifie que le mot de passe a au moins 8 caractères, une majuscule, un chiffre
  const validatePassword = (password: string) => {
    return (
      password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)
    );
  };

  // Envoi du formulaire d’inscription
  const handleRegister = async () => {
    // Reset des erreurs
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;

    // Vérifications des champs
    if (!email) {
      setEmailError("Veuillez entrer un email.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Adresse email invalide.");
      isValid = false;
    }

    if (!mdp) {
      setPasswordError("Veuillez entrer un mot de passe.");
      isValid = false;
    } else if (!validatePassword(mdp)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre."
      );
      isValid = false;
    }

    if (!confirmMdp) {
      setConfirmPasswordError("Veuillez confirmer votre mot de passe.");
      isValid = false;
    } else if (mdp !== confirmMdp) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas.");
      isValid = false;
    }

    if (!isValid) return; // Stop si erreur de validation

    // Envoie les données au backend
    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: mdp }),
      });

      const data = await response.json();

      // Affiche les erreurs du backend
      if (!response.ok) {
        if (data.message.includes("email")) {
          setEmailError(data.message);
        } else {
          setPasswordError(data.message);
        }
        return;
      }

      // Message de succès
      Toast.show({
        type: "success",
        text1: "Succès 🎉",
        text2: "Votre compte a été créé avec succès",
        position: "top",
      });

      // Redirection vers la page de connexion après 3 secondes
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'inscription. Réessayez plus tard.");
    }
  };

  // Revenir à la page d'accueil via le logo
  const handleLogoPress = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      router.push("/");
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  // Affichage de l'écran
  return (
    <View style={styles.container}>
      {/* 🔙 Bouton retour tout en haut à gauche */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      {/*Logo cliquable */}
      <View style={styles.header}>
        <Pressable onPress={handleLogoPress}>
          <Image
            source={require("../../images/logo.png")}
            style={styles.logo}
            testID="logo"
          />
        </Pressable>
      </View>

      <Text style={styles.title}>Inscription</Text>

      {/* Champ email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Votre email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      {/* Mot de passe */}
      <Text style={styles.label}>Mot de passe</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Votre mot de passe"
          secureTextEntry={!showPassword}
          value={mdp}
          onChangeText={setMdp}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/*Confirmation du mot de passe */}
      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirmez votre mot de passe"
          secureTextEntry={!showConfirmPassword}
          value={confirmMdp}
          onChangeText={setConfirmMdp}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}

      {/* Bouton valider */}
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Valider</Text>
      </Pressable>
    </View>
  );
}
