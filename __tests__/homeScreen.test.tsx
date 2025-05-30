import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import HomeScreen from "../app/(tabs)/index";
import { VoteProvider } from "../app/contexts/VoteContext";
import fetchMock from "jest-fetch-mock";

// Mock de expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: any) => cb(), // Simule l'effet focus
}));

// Mock complet d'AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Reset de fetch mock
beforeEach(() => {
  fetchMock.resetMocks();
});

describe("HomeScreen", () => {
  it("affiche les films et les boutons Voter", async () => {
    // Mock de l'API TMDB
    fetchMock.mockResponseOnce(
      JSON.stringify({
        results: [
          { id: 1, title: "Le Parrain", poster_path: "/parrain.jpg" },
          { id: 2, title: "Pulp Fiction", poster_path: "/pulp.jpg" },
        ],
      })
    );

    const { getByText, getAllByText } = render(
      <VoteProvider>
        <HomeScreen />
      </VoteProvider>
    );

    // Attendre le rendu des films
    await waitFor(() => expect(getByText("Le Parrain")).toBeTruthy());

    // Vérifier les boutons "Voter"
    const voteButtons = getAllByText("Voter");
    expect(voteButtons.length).toBeGreaterThan(0);
  });
});
