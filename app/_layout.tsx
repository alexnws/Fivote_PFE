import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import React from "react";
import Toast from "react-native-toast-message";
import { VoteProvider } from "./contexts/VoteContext";
import { UserProvider } from "./contexts/userContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <VoteProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
          <Toast />
        </SafeAreaView>
      </VoteProvider>
    </UserProvider>
  );
}
