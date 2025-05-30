import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
} from "react-native";
import { UserContext } from "./contexts/userContext";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MyCinemaScreen() {
  const { userToken, userRole } = useContext(UserContext)!;
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchMyMovies = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/my-cinema", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await res.json();
      setMovies(data || []);
    } catch (err) {
      console.log("Erreur fetch my-cinema:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userToken || userRole !== "cinemaPartner") {
      Alert.alert("Accès refusé", "Vous n’avez pas les droits.");
      router.push("/");
    } else {
      fetchMyMovies();
    }
  }, [userToken]);

  const resetForm = () => {
    setTitle("");
    setYear("");
    setPosterUrl("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title || !year || !posterUrl) {
      Alert.alert("Champs manquants", "Veuillez remplir tous les champs");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const endpoint = editingId
      ? `http://localhost:5001/api/my-cinema/${editingId}`
      : "http://localhost:5001/api/my-cinema";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ title, year, posterUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data.message || "Erreur de soumission");
      } else {
        Alert.alert("Succès", editingId ? "Film modifié" : "Film ajouté");
        resetForm();
        setFormVisible(false);
        fetchMyMovies();
      }
    } catch (err) {
      Alert.alert("Erreur", "Problème de connexion au serveur");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmation", "Supprimer ce film ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            const res = await fetch(
              `http://localhost:5001/api/my-cinema/${id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${userToken}` },
              }
            );
            const data = await res.json();
            if (!res.ok) {
              Alert.alert("Erreur", data.message);
            } else {
              Alert.alert("Supprimé", "Film supprimé");
              fetchMyMovies();
            }
          } catch {
            Alert.alert("Erreur", "Problème réseau");
          }
        },
      },
    ]);
  };

  const handleEdit = (movie: any) => {
    setFormVisible(true);
    setTitle(movie.title);
    setYear(movie.release_date.slice(0, 4));
    setPosterUrl(movie.poster_path);
    setEditingId(movie._id);
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>🎞️ Espace Partenaire</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => {
          setFormVisible(!formVisible);
          resetForm();
        }}
      >
        <Text style={styles.buttonText}>
          {formVisible ? "Fermer le formulaire" : "Ajouter un film"}
        </Text>
      </Pressable>

      {formVisible && (
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
          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {editingId ? "Modifier" : "Ajouter"}
            </Text>
          </Pressable>
        </>
      )}

      <Text style={styles.subtitle}>🎬 Vos films</Text>

      {movies.map((movie) => (
        <View key={movie._id} style={styles.movieItem}>
          <Image
            source={{ uri: movie.poster_path }}
            style={{
              width: 100,
              height: 150,
              borderRadius: 6,
              marginBottom: 10,
            }}
          />
          <Text style={styles.movieTitle}>
            {movie.title} ({movie.release_date.slice(0, 4)})
          </Text>
          <View style={styles.actionRow}>
            <Pressable onPress={() => handleEdit(movie)} style={styles.editBtn}>
              <Text style={styles.actionText}>Modifier</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDelete(movie._id)}
              style={styles.deleteBtn}
            >
              <Text style={styles.actionText}>Supprimer</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitText: { color: "white", fontWeight: "bold" },
  buttonText: { color: "white", fontWeight: "bold" },
  movieItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  movieTitle: { fontSize: 16, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 5 },
  editBtn: { backgroundColor: "#ffa500", padding: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: "#ff5555", padding: 8, borderRadius: 6 },
  actionText: { color: "white", fontWeight: "bold" },
  backButton: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
});
