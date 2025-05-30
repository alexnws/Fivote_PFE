import React, { useContext } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserContext } from "./contexts/userContext";
import { VoteContext } from "./contexts/VoteContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { userToken, setUserToken, userRole, userEmail, setUserEmail } =
    useContext(UserContext)!;

  const { setVotedMovies } = useContext(VoteContext)!;
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setUserToken(null);
    setUserEmail(null);
    setVotedMovies([]);
    Alert.alert("Déconnexion", "Vous avez été déconnecté.");
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Flèche retour tout en haut */}
      <Pressable
        onPress={() => router.back()}
        style={styles.absoluteBackButton}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </Pressable>

      {/* Contenu centré */}
      <View style={styles.centeredContainer}>
        <Text style={styles.title}>Profil</Text>
        <Text style={styles.text}>Email : {userEmail || "Non disponible"}</Text>
        <Text style={styles.text}>Rôle : {userRole || "Non défini"}</Text>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  absoluteBackButton: {
    position: "absolute",
    top: 16, //Le plus haut possible tout en respectant la safe area
    left: 16,
    zIndex: 10,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
