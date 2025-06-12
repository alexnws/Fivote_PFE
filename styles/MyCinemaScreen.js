import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitText: { color: "white", fontWeight: "bold" },
  buttonText: { color: "white", fontWeight: "bold" },
  movieItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  movieTitle: { fontSize: 16, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 5 },
  editBtn: { backgroundColor: "#ffa500", padding: 8, borderRadius: 6 },
  deleteBtn: { backgroundColor: "#ff5555", padding: 8, borderRadius: 6 },
  actionText: { color: "white", fontWeight: "bold" },
  backButton: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
});
