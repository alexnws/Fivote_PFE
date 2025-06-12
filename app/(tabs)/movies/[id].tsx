import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../styles/MovieDetailScreen";
import { VoteContext } from "../../contexts/VoteContext";

export default function MovieDetailScreen() {
  const router = useRouter();
  const { id, source } = useLocalSearchParams<{
    id: string;
    source?: string;
  }>();

  const {
    votedMovies,
    userToken,
    userRole,
    refreshVotes,
    setVotedMovies,
    refreshMoviesGlobally,
  } = useContext(VoteContext)!;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voteCount, setVoteCount] = useState<number>(0);

  const hasVoted = votedMovies.includes(Number(id));

  const fetchMovie = async () => {
    try {
      const isMongoId =
        typeof id === "string" && id.length === 24 && /^[a-f\d]{24}$/i.test(id);
      const isCustomSource = source === "custom" || source === "partner";

      if (isCustomSource || isMongoId) {
        const res = await fetch(`http://localhost:5001/api/movies/${id}`);
        const data = await res.json();
        setMovie(data);
      } else {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=1f0af41aa1b8961b4cc87398cc3a827d&language=fr-FR`
        );
        const data = await res.json();
        if (data.status_code === 34) {
          throw new Error("Film non trouvé sur TMDB");
        }
        setMovie(data);
      }
    } catch (err) {
      console.error("❌ Erreur fetchMovie :", err);
      Alert.alert("Erreur", "Film introuvable.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteCount = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/votes/${id}`);
      const data = await res.json();
      setVoteCount(data.voteCount || 0);
    } catch {
      setVoteCount(0);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchMovie();
      fetchVoteCount();
      refreshVotes();
    }, [id])
  );

  const handleVote = async () => {
    if (!userToken) {
      Alert.alert("Connexion requise", "Veuillez vous connecter pour voter.");
      router.push("/login");
      return;
    }

    if (userRole !== "user") return;

    try {
      const res = await fetch(`http://localhost:5001/api/votes/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Erreur", data.message || "Impossible de voter.");
      } else {
        Alert.alert("Merci pour votre vote !");
        setVotedMovies((prev) => [...prev, Number(id)]);
        fetchVoteCount();
        refreshMoviesGlobally();
      }
    } catch (error) {
      Alert.alert("Erreur", "Une erreur s’est produite lors du vote.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="black" />;
  if (!movie) return <Text>Film introuvable.</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginTop: 10, marginLeft: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Image
        source={{
          uri: movie?.poster_path
            ? source === "custom" || source === "partner"
              ? movie.poster_path.startsWith("http")
                ? movie.poster_path
                : `http://localhost:5001${movie.poster_path}`
              : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750.png?text=Image+non+disponible",
        }}
        style={styles.poster}
        onError={() =>
          console.log("❌ Échec du chargement de l’image", movie?.poster_path)
        }
      />

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.subtitle}>
        Sorti le : {movie.release_date?.slice(0, 10)}
      </Text>
      <Text style={styles.sectionTitle}>Résumé</Text>
      <Text style={styles.overview}>
        {movie.summary && movie.summary.trim() !== ""
          ? movie.summary
          : movie.overview && movie.overview.trim() !== ""
          ? movie.overview
          : "Aucune description disponible."}
      </Text>

      <Text style={styles.sectionTitle}>👍 Votes : {voteCount}</Text>

      <TouchableOpacity
        onPress={handleVote}
        disabled={hasVoted}
        style={[styles.voteButton, hasVoted && styles.voteButtonDisabled]}
      >
        <Text style={styles.voteButtonText}>
          {hasVoted
            ? "Déjà voté"
            : !userToken
            ? "Se connecter pour voter"
            : userRole !== "user"
            ? "Vote désactivé"
            : "Je vote !"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
