import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../app/(tabs)/login";

// mock router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// mock AsyncStorage
const mockSetItem = jest.fn();
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: (...args: any[]) => mockSetItem(...args),
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ token: "fake-token" }),
    })
  ) as jest.Mock;
  jest.clearAllMocks();
});

test("connecte l'utilisateur avec un token", async () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);

  fireEvent.changeText(getByPlaceholderText("Votre email"), "test@example.com");
  fireEvent.changeText(
    getByPlaceholderText("Votre mot de passe"),
    "Motdepasse1"
  );
  fireEvent.press(getByText("Se connecter"));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5001/api/auth/login",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(mockSetItem).toHaveBeenCalledWith("token", "fake-token");
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});
