import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { PRIMARYCOLOR, SECONDARYCOLOR, TERSIARYCOLOR } from "../constants";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import auth from "../server";

const titleImage = require("../../assets/chess-falling.gif");

export default function LogUserInPage(props: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [errorMessage, setErrorMesage] = useState(
    "This is my first React Native app. I'm using it to learn React Native and TypeScript."
  );
  const [loading, setLoading] = useState(false);

  const handleRegisterPress = () => {
    // take user to registerPage
    props.navigation.navigate("RegisterUserPage");
  };

  const handleLoginPress = () => {
    // make the user stay logged in even after the app is closed
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user.displayName, user.email, user.photoURL);
        setEmail("");
        setPassword("");
        setErrorMesage("");
      })
      .catch((error) => {
        //unsuccesfull
        console.log(error);
        // console.log(auth.currentUser);
        setErrorMesage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const toggleSecureEntry = () => {
    // password icon visibility toggler
    setSecureEntry(!secureEntry);
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Image source={titleImage} style={styles.image} />
      <Text style={styles.heading}>Login</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email </Text>
        <TextInput
          style={[styles.input, { marginLeft: 26 }]}
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
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        {loading ? (
          <ActivityIndicator color="white" size="small"></ActivityIndicator>
        ) : (
          <Text style={styles.buttonText}>LET'S PLAY</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRegisterPress}>
        <Text style={styles.registerButton}>
          if you arent a user click here
        </Text>
      </TouchableOpacity>
      <Text style={styles.paragraph}>{errorMessage}</Text>
    </KeyboardAvoidingView>
  );
}

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
