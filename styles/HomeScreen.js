import { StyleSheet } from "react-native";

export const HomeScreen = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 0,
    paddingRight: 20,
    backgroundColor: "#fff",
    height: 80,
    zIndex: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },

  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginLeft: 0,
    alignSelf: "flex-start",
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  loginButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },

  registerButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },

  registerButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  content: {
    marginTop: 80,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  slogan: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  moviesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  movieCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  posterContainer: {
    marginRight: 10,
  },

  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },

  movieInfo: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },

  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },

  voteButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  voteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },

  voteButtonDisabled: {
    backgroundColor: "#aaa",
  },

  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },

  voteCount: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});
