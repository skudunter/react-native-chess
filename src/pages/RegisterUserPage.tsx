import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARYCOLOR, SECONDARYCOLOR, TERSIARYCOLOR } from "../constants";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../server";

const titleImage = require("../../assets/register-2.gif");

export default function RegisterUserPage({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterPress = () => {
    setLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // registered
        setEmail("");
        setPassword("");
        setErrorMessage("");
        navigation.navigate("LoginUserPage");
      })
      .catch((error) => {
        // unsuccesfull
        setErrorMessage(error.message);
        console.log(error);
      }).finally(()=>{
        setLoading(false);
      });
  };
  const handleLoginPress = () => {
    // go to the login page
    navigation.navigate("LoginUserPage");
  };

  const toggleSecureEntry = () => {
    // password icon visibility toggler
    setSecureEntry(!secureEntry);
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image
        source={titleImage}
        style={styles.image}
      />
      <Text style={styles.heading}>Register</Text>
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { marginLeft: 30 }]}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#999"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry={secureEntry}
        />
        <TouchableOpacity
          onPress={toggleSecureEntry}
          style={styles.secureEntry}
        >
          <MaterialIcons
            name={secureEntry ? "visibility" : "visibility-off"}
            size={24}
            color={TERSIARYCOLOR}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
      {loading ? (
          <ActivityIndicator color="white" size="small"></ActivityIndicator>
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLoginPress}>
        <Text style={styles.registerButton}>
          if you already have an account click here
        </Text>
      </TouchableOpacity>
      <Text style={styles.paragraph}>{errorMessage}</Text>
    </KeyboardAvoidingView>
  );
}
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARYCOLOR,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    overflow: "hidden",
  },
  image: {
    width: 150,
    height: 100,
    marginBottom: 30,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: TERSIARYCOLOR,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginRight: 16,
    color: TERSIARYCOLOR,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: TERSIARYCOLOR,
  },
  button: {
    backgroundColor: SECONDARYCOLOR,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 16,
    marginTop: 50,
    textAlign: "center",
    fontStyle: "italic",
    color: "#777",
    lineHeight: 24,
  },
  registerButton: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    color: "#afafaf",
    lineHeight: 24,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: "#afafaf",
  },
  secureEntry: {
    position: "absolute",
    right: 8,
  },
});
