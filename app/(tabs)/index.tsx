import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen as styles } from "../../styles/HomeScreen";

import { VoteContext } from "../contexts/VoteContext";
import { UserContext } from "../contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  const { votedMovies, refreshVotes, setVotedMovies, moviesRefreshTrigger } =
    useContext(VoteContext)!;
  const { userToken, setUserToken, userRole } = useContext(UserContext)!;

  const [isNavigating, setIsNavigating] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hasVoted = (movieId: number) => votedMovies.includes(movieId);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      let tmdbMovies: any[] = [];
      let adminMovies: any[] = [];
      let partnerMovies: any[] = [];
      let voteCounts: Record<string, number> = {};

      //Récupère les compteurs de vote
      try {
        const res = await fetch("http://localhost:5001/api/votes/counts");
        const data = await res.json();
        voteCounts = data || {};
      } catch (err) {
        console.warn("⚠️ Erreur récupération voteCounts :", err);
      }

      //TMDB
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=1f0af41aa1b8961b4cc87398cc3a827d&language=fr-FR&sort_by=popularity.desc&primary_release_date.lte=1999-12-31`
        );
        const data = await res.json();
        tmdbMovies = (data.results || []).map((movie: any) => ({
          ...movie,
          source: "tmdb",
          voteCount: voteCounts[String(movie.id)] || 0,
        }));
      } catch (err) {
        console.warn("⚠️ Erreur TMDB :", err);
      }

      // Admin
      try {
        const res = await fetch("http://localhost:5001/api/movies");
        const data = await res.json();
        adminMovies = (data || []).map((movie: any) => ({
          ...movie,
          source: "custom",
          voteCount: voteCounts[movie.id] || movie.voteCount || 0,
        }));
      } catch (err) {
        console.warn("⚠️ Erreur API admin :", err);
      }

      //Partenaires
      try {
        const res = await fetch("http://localhost:5001/api/cinema-movies");
        const data = await res.json();
        partnerMovies = (data || []).map((movie: any) => ({
          ...movie,
          source: "partner",
          voteCount: voteCounts[movie.id] || movie.voteCount || 0,
        }));
      } catch (err) {
        console.warn("⚠️ Erreur API partenaires :", err);
      }

      //Supprime les doublons
      const all = [...adminMovies, ...partnerMovies, ...tmdbMovies];
      const uniqueMovies = Array.from(
        new Map(
          all.map((movie) => {
            const key = movie._id || `${movie.source}-${movie.id}`;
            return [key, movie];
          })
        ).values()
      );

      setMovies(uniqueMovies);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger les films");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMovies();
      refreshVotes();
    }, [moviesRefreshTrigger])
  );

  const handleNavigation = (screen: string) => {
    if (!isNavigating) {
      setIsNavigating(true);
      router.push(screen as any);
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => handleNavigation("/")}>
          <Image
            source={require("../../images/logo.png")}
            style={styles.logo}
          />
        </Pressable>

        <View style={styles.buttonContainer}>
          {userToken && userRole === "admin" && (
            <Pressable
              style={styles.loginButton}
              onPress={() => handleNavigation("/admin")}
            >
              <Text style={styles.registerButtonText}>Espace Admin</Text>
            </Pressable>
          )}
          {userToken && userRole === "cinemaPartner" && (
            <Pressable
              style={styles.loginButton}
              onPress={() => handleNavigation("/myCinema")}
            >
              <Text style={styles.registerButtonText}>Espace partenaire</Text>
            </Pressable>
          )}

          {userToken ? (
            <Pressable onPress={() => handleNavigation("/profile")}>
              <Ionicons name="person-circle-outline" size={32} color="black" />
            </Pressable>
          ) : (
            <>
              <Pressable
                style={styles.loginButton}
                onPress={() => handleNavigation("/login")}
              >
                <Text style={styles.registerButtonText}>Connexion</Text>
              </Pressable>
              <Pressable
                style={styles.registerButton}
                onPress={() => handleNavigation("/register")}
              >
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Fivote</Text>
        <Text style={styles.slogan}>
          Votez pour redécouvrir les classiques du cinéma sur grand écran !
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlatList
            data={movies}
            keyExtractor={(item) =>
              `${item.source || "custom"}-${item.id || item._id}`
            }
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Pressable
                  onPress={() =>
                    handleNavigation(`/movies/${item.id}?source=${item.source}`)
                  }
                  style={styles.posterContainer}
                >
                  <Image
                    source={{
                      uri:
                        item.source === "tmdb"
                          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                          : item.poster_path?.startsWith("http")
                          ? item.poster_path
                          : `http://localhost:5001${item.poster_path}`,
                    }}
                    style={styles.poster}
                    onError={() =>
                      console.log("❌ Image non chargée :", item.poster_path)
                    }
                  />
                </Pressable>

                <View style={styles.movieInfo}>
                  <Text style={styles.movieTitle}>{item.title}</Text>

                  {item.voteCount !== undefined && (
                    <Text style={styles.voteCount}>
                      👍 {item.voteCount} vote{item.voteCount > 1 ? "s" : ""}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={() =>
                    handleNavigation(`/movies/${item.id}?source=${item.source}`)
                  }
                  style={[
                    styles.voteButton,
                    hasVoted(item.id) && styles.voteButtonDisabled,
                  ]}
                  disabled={hasVoted(item.id)}
                >
                  <Text style={styles.voteButtonText}>
                    {hasVoted(item.id) ? "Déjà voté" : "Voter"}
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
