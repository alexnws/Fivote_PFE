import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Définition du type des données dans le contexte
export type VoteContextType = {
  votedMovies: number[];
  setVotedMovies: React.Dispatch<React.SetStateAction<number[]>>;
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshVotes: () => void;
  refreshMoviesGlobally: () => void;
  moviesRefreshTrigger: number;
};

//Création du contexte
export const VoteContext = createContext<VoteContextType | undefined>(
  undefined
);

export const VoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [votedMovies, setVotedMovies] = useState<number[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [moviesRefreshTrigger, setMoviesRefreshTrigger] = useState(0);

  // Forcer la mise à jour de la liste des films
  const refreshMoviesGlobally = () => {
    setMoviesRefreshTrigger((prev) => prev + 1);
  };

  // Rechargement des votes
  const refreshVotes = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    setUserToken(token);

    if (token) {
      try {
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
      setVotedMovies([]);
    }
  }, []);

  //Chargement initial
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
        refreshVotes,
        refreshMoviesGlobally,
        moviesRefreshTrigger,
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};
