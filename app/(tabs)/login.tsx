import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LoginScreen as styles } from "../../styles/LoginScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Import du UserContext
import { UserContext } from "../contexts/userContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  // Accès aux fonctions de contexte utilisateur
  const { setUserToken, refreshUser } = useContext(UserContext)!;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.message || "Connexion échouée");
        return;
      }

      if (data.token) {
        // Sauvegarde et MAJ du contexte
        await AsyncStorage.setItem("token", data.token);
        setUserToken(data.token);
        refreshUser(); // met à jour userRole

        Alert.alert("Succès", "Connexion réussie");
        router.push("/");
      } else {
        Alert.alert("Erreur", "Aucun token reçu depuis le serveur");
      }
    } catch (error) {
      Alert.alert("Erreur", "Problème de connexion au serveur");
      console.error(error);
    }
  };

  const handleLogoPress = () => {
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Pressable onPress={handleLogoPress}>
          <Image
            source={require("../../images/logo.png")}
            style={styles.logo}
            testID="logo"
          />
        </Pressable>
      </View>

      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Votre email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Votre mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </Pressable>

      {/* 🔽 Lien vers l'inscription */}
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ fontSize: 14 }}>
          Pas de compte ?{" "}
          <Text
            onPress={() => router.push("/register")}
            style={{ color: "#1e90ff", fontWeight: "bold" }}
          >
            S’inscrire
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
