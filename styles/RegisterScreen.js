import { StyleSheet } from "react-native";

export const RegisterScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 10,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  inputPassword: {
    flex: 1,
    paddingVertical: 10,
  },
  eyeButton: {
    padding: 5,
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
