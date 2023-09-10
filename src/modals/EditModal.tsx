import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  FOURTHCOLOR,
  OS,
  PRIMARYCOLOR,
  SECONDARYCOLOR,
  TERSIARYCOLOR,
} from "../constants";
import { MaterialIcons } from "@expo/vector-icons";
import auth, { database } from "../server";
import { ref, update } from "firebase/database";
import { uploadImageToFirebase } from "../server";
import { updateProfile } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import CameraModal from "./CameraModal";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

type props = {
  visible: boolean;
  setEditModalVisible: (value: boolean) => void;
  username: string;
  setUsername: (value: string) => void;
  photoURL: string;
  setPhotoURL: (value: string) => void;
  setPfpHasLoaded: (value: boolean) => void;
};

export default function EditModal({
  visible,
  setEditModalVisible,
  username,
  setUsername,
  photoURL,
  setPhotoURL,
  setPfpHasLoaded,
}: props) {
  const [user] = useAuthState(auth);
  const [text, setText] = useState(username);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const [placeholderPhotoURL, setPlaceholderPhotoURL] = useState(
    photoURL === "" ? "" : photoURL
  );
  const [loading, setLoading] = useState(false);
  const [changedPfp, setChangedPfp] = useState(false);

  function onClose() {
    setText(username);
    setPlaceholderPhotoURL(photoURL);
    setEditModalVisible(false);
    setLoading(false);
    setChangedPfp(false);
  }
  function handleEditPress() {
    if (user) {
      //if no image is selected, update username serverside
      setLoading(true);
      if (!changedPfp) {
        //update username serverside
        updateProfile(user, {
          displayName: text,
        })
          .then(() => {
            if (OS == "web") {
              alert("Username Updated");
            }
            Alert.alert("Username Updated");
          })
          .finally(() => {
            setLoading(false);
            let dbRef = ref(database, "users/" + user.uid);
            update(dbRef, { username: text, pfpUrl: user.photoURL })
              .then(() => {
                // console.log("data updated to db");
              })
              .catch((error) => {
                console.log(error);
              });
          });
        setUsername(text);
      } else if (changedPfp) {
        //add the photo to firebase storage
        setLoading(true);
        uploadImageToFirebase(placeholderPhotoURL, auth.currentUser?.uid).then(
          (downloadURL) => {
            updateProfile(user, {
              photoURL: downloadURL,
              displayName: text,
            })
              .then(() => {
                if (OS == "web") {
                  alert("Profile Updated");
                }
                Alert.alert("Profile Updated");
                setUsername(text);
                setPfpHasLoaded(false);
                if (auth!.currentUser!.photoURL) {
                  setPhotoURL(auth!.currentUser!.photoURL);
                }
              })
              .finally(() => {
                setChangedPfp(false);
                setLoading(false);
                let dbRef = ref(database, "users/" + user.uid);
                update(dbRef, { username: text, pfpUrl: user.photoURL })
                  .then(() => {
                    // console.log("data updated to db");
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              });
          }
        );
      }
   
    } else {
      // console.log("no user logged in");
    }
  }
  function logOut() {
    //alert does not work on web
    if (OS === "web") {
      auth.signOut();
    }
    Alert.alert("Logout Confirmation", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          auth.signOut();
        },
      },
    ]);
  }

  async function handlePhotoSelection() {
    // alert only works on mobile devices
    if (OS == "web") {
      //choose from libary for web
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: false,
        base64: true,
      });
      if (result.assets) {
        if (result.assets[0].uri) {
          setChangedPfp(true);
          // console.log(changedPfp);
          setPlaceholderPhotoURL(result.assets[0].uri);
        }
      }
    } else {
      Alert.alert("Photo Selection", "Select a photo", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: () => {
            setCameraModalVisible(true);
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 1,
              allowsMultipleSelection: false,
              base64: true,
            });
            if (result.assets) {
              if (result.assets[0].uri) {
                setChangedPfp(true);
                // console.log(changedPfp);
                setPlaceholderPhotoURL(result.assets[0].uri);
              }
            }
          },
        },
      ]);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <CameraModal
        visible={cameraModalVisible}
        setCameraModalVisible={setCameraModalVisible}
        placeholderPhotoURL={placeholderPhotoURL}
        setPlaceholderPhotoURL={setPlaceholderPhotoURL}
        changedPfp={changedPfp}
        setChangedPfp={setChangedPfp}
      ></CameraModal>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={[SECONDARYCOLOR, PRIMARYCOLOR]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 0.7 }}
            style={styles.gradientContainer}
          >
            <View
              style={[
                { alignItems: "center", width: "100%" },
                loading ? { opacity: 0.5 } : { opacity: 1 },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  if (!loading) {
                    onClose();
                  }
                }}
              >
                <MaterialIcons name="close" size={30} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.logOutButton} onPress={logOut}>
                <MaterialIcons name="logout" size={30} color="#555" />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Your Information</Text>
              <View style={styles.imageContainer}>
                <View style={styles.circleImage}>
                  <TouchableOpacity onPress={handlePhotoSelection}>
                    {placeholderPhotoURL === "" ? (
                      <MaterialIcons
                        name="add-a-photo"
                        size={100}
                        color="#333"
                      />
                    ) : (
                      <Image
                        source={{ uri: placeholderPhotoURL }}
                        style={styles.circleImage}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Username"
                value={text}
                onChangeText={(value) => setText(value)}
                placeholderTextColor={TERSIARYCOLOR}
              />
              <View>
                <Text style={styles.paragraph}>
                  This could be your first name or a nickname.
                </Text>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleEditPress}>
                {loading ? (
                  <ActivityIndicator
                    color="white"
                    size="small"
                  ></ActivityIndicator>
                ) : (
                  <Text style={styles.buttonText}>Edit</Text>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: PRIMARYCOLOR,
    width: "100%",
    height: "93%",
    borderRadius: 10,
    alignItems: "center",
  },
  gradientContainer: {
    width: "100%",
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: TERSIARYCOLOR,
  },
  imageContainer: {
    height: 150,
    width: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: FOURTHCOLOR,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  circleImage: {
    height: 130,
    width: 130,
    borderRadius: 65,
    backgroundColor: TERSIARYCOLOR,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: FOURTHCOLOR,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: "100%",
    marginBottom: 20,
    color: TERSIARYCOLOR,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  paragraph: {
    marginBottom: 20,
    color: TERSIARYCOLOR,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: SECONDARYCOLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: TERSIARYCOLOR,
    fontWeight: "bold",
  },
  logOutButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
});
