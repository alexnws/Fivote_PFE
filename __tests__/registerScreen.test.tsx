import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../app/(tabs)/register";

// Mock icons to avoid `expo-font` issues
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => null,
}));

// Mock router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock toast
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: "OK" }),
    })
  ) as jest.Mock;
  jest.clearAllMocks();
});

test("envoie le formulaire avec succès", async () => {
  jest.useFakeTimers(); // Active les timers factices

  const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

  fireEvent.changeText(getByPlaceholderText("Votre email"), "test@example.com");
  fireEvent.changeText(
    getByPlaceholderText("Votre mot de passe"),
    "Motdepasse1"
  );
  fireEvent.changeText(
    getByPlaceholderText("Confirmez votre mot de passe"),
    "Motdepasse1"
  );

  fireEvent.press(getByText("Valider"));

  // Attendre l'appel à fetch
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5001/api/auth/register",
      expect.objectContaining({ method: "POST" })
    );
  });

  // Forcer l'exécution du setTimeout (redirection après 3s)
  jest.advanceTimersByTime(3000);

  // Attendre la redirection
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
