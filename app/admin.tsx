import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { UserContext } from "./contexts/userContext";
import { useRouter } from "expo-router";

export default function AdminScreen() {
  const { userToken, userRole } = useContext(UserContext)!;
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!userToken || userRole !== "admin") {
        Alert.alert(
          "Accès refusé",
          "Vous devez être connecté en tant qu’admin."
        );
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5001/api/admin", {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAccess(true);
        } else {
          Alert.alert("Erreur", data.message || "Accès refusé");
        }
      } catch {
        Alert.alert("Erreur", "Impossible de vérifier les droits d’accès.");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleAddMovie = async () => {
    if (!title || !year || !posterUrl) {
      Alert.alert("Champs manquants", "Veuillez renseigner tous les champs.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/admin/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ title, year, posterUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data.message || "Erreur lors de l’ajout.");
      } else {
        Alert.alert("Succès", "Film ajouté avec succès !", [
          {
            text: "OK",
            onPress: () => router.push("/"), //redirection vers page d’accueil
          },
        ]);
      }
    } catch (err) {
      Alert.alert("Erreur", "Une erreur est survenue.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="black" style={{ marginTop: 40 }} />
    );
  if (!access) return <Text style={styles.error}>⛔ Accès refusé</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎬 Interface Admin</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => setShowForm((prev) => !prev)}
      >
        <Text style={styles.addButtonText}>Ajouter un film</Text>
      </Pressable>

      {showForm && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Année"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="URL de l’affiche"
            value={posterUrl}
            onChangeText={setPosterUrl}
          />
          <Pressable style={styles.submitButton} onPress={handleAddMovie}>
            <Text style={styles.submitButtonText}>Ajouter</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
