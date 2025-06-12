import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "./contexts/userContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import styles from "../styles/MyCinemaScreen";

export default function MyCinemaScreen() {
  const { userToken, userRole } = useContext(UserContext)!;
  const router = useRouter();

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [summary, setSummary] = useState("");
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
    setSummary("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!title || !year || !posterUrl || !summary) {
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
        body: JSON.stringify({ title, year, posterUrl, summary }),
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
    setSummary(movie.summary || "");
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
          <TextInput
            style={styles.input}
            placeholder="Résumé"
            value={summary}
            onChangeText={setSummary}
            multiline
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
          <Text style={{ fontStyle: "italic", marginTop: 5 }}>
            {movie.summary}
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
