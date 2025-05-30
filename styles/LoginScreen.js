import { StyleSheet } from "react-native";

export const LoginScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start", //Aligne comme RegisterScreen
    paddingTop: 100, //Même marge que RegisterScreen
  },
  header: {
    alignItems: "center",
    marginBottom: 20, //Même espace sous le logo que RegisterScreen
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10, //Harmonisé avec RegisterScreen
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
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
});
