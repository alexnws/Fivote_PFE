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
      if (source === "custom") {
        const res = await fetch(`http://localhost:5001/api/movies/${id}`);
        const data = await res.json();
        setMovie(data);
      } else {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=1f0af41aa1b8961b4cc87398cc3a827d&language=fr-FR`
        );
        const data = await res.json();
        setMovie(data);
      }
    } catch {
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
        fetchVoteCount(); // Met à jour localement
        refreshMoviesGlobally(); // Met à jour la home page
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
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
        style={styles.poster}
      />

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.subtitle}>
        Sorti le : {movie.release_date?.slice(0, 10)}
      </Text>
      <Text style={styles.sectionTitle}>Résumé</Text>
      <Text style={styles.overview}>{movie.overview || "Pas de résumé."}</Text>

      <Text style={styles.sectionTitle}>👍 Votes : {voteCount}</Text>

      <TouchableOpacity
        onPress={handleVote}
        disabled={hasVoted}
        style={[styles.voteButton, hasVoted && styles.voteButtonDisabled]}
      >
        <Text style={styles.voteButtonText}>
          {hasVoted ? "Déjà voté" : "Je vote !"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
