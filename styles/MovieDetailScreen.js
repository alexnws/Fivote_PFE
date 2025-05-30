import { StyleSheet } from "react-native";

const MovieDetailScreen = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  posterWrapper: {
    position: "relative",
  },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
    elevation: 4,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    lineHeight: 22,
  },
  voteButton: {
    backgroundColor: "#1e90ff",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  voteButtonDisabled: {
    backgroundColor: "#ccc",
  },
  voteButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default MovieDetailScreen;
