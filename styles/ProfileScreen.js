import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  absoluteBackButton: {
    position: "absolute",
    top: 16, // Respecte la safe area
    left: 16,
    zIndex: 10,
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
