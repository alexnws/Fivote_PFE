import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Définition du type du contexte
export type VoteContextType = {
  votedMovies: number[];
  setVotedMovies: React.Dispatch<React.SetStateAction<number[]>>;
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  refreshVotes: () => void;
  refreshMoviesGlobally: () => void;
  moviesRefreshTrigger: number;
};

// Création du contexte
export const VoteContext = createContext<VoteContextType | undefined>(
  undefined
);

export const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [votedMovies, setVotedMovies] = useState<number[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [moviesRefreshTrigger, setMoviesRefreshTrigger] = useState(0);

  // Forcer la mise à jour de la liste des films
  const refreshMoviesGlobally = () => {
    setMoviesRefreshTrigger((prev) => prev + 1);
  };

  // Rechargement des votes et récupération du rôle
  const refreshVotes = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    setUserToken(token);

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserRole(decoded.role); // ou decoded.user.role selon ton token

        const res = await fetch("http://localhost:5001/api/votes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const ids = data.votes.map((vote: any) => Number(vote.movieId));
        setVotedMovies(ids);
      } catch (err) {
        console.log("Erreur chargement des votes :", err);
      }
    } else {
      setUserRole(null);
      setVotedMovies([]);
    }
  }, []);

  useEffect(() => {
    refreshVotes();
  }, []);

  return (
    <VoteContext.Provider
      value={{
        votedMovies,
        setVotedMovies,
        userToken,
        setUserToken,
        userRole,
        setUserRole,
        refreshVotes,
        refreshMoviesGlobally,
        moviesRefreshTrigger,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};
