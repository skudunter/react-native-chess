import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { PRIMARYCOLOR, OS, TERSIARYCOLOR, SECONDARYCOLOR } from "../constants";
import LoadingPage from "../pages/LoadingPage";

type Props = {
  visible: boolean;
  setCameraModalVisible: (visible: boolean) => void;
  placeholderPhotoURL: string;
  setPlaceholderPhotoURL: (value: string) => void;
  changedPfp:boolean;
  setChangedPfp: (value: boolean) => void;
};

export default function CameraModal({
  visible,
  setCameraModalVisible,
  placeholderPhotoURL,
  setPlaceholderPhotoURL,
  changedPfp,
  setChangedPfp
}: Props) {
  const [type, setType] = useState(CameraType.front);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      //web does not need camera permissions
      if (OS === "web") {
        return;
      }
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={false}
      onRequestClose={() => {
        setCameraModalVisible(false);
      }}
    >
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {hasPermission === null ? (
          <LoadingPage />
        ) : hasPermission === false ? (
          <>
            <Text>No access to camera</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setCameraModalVisible(false);
              }}
            >
              <MaterialIcons name="close" size={40} color={TERSIARYCOLOR} />
            </TouchableOpacity>
          </>
        ) : (
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <MaterialIcons
                  name="flip-camera-ios"
                  size={40}
                  color={TERSIARYCOLOR}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setCameraModalVisible(false);
                }}
              >
                <MaterialIcons name="close" size={40} color={TERSIARYCOLOR} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={async () => {
                  // take photo
                  if (cameraRef.current) {
                    const options = { quality: 0.1, base64: true };
                    const photo = await cameraRef.current.takePictureAsync(options);
                    setChangedPfp(true);
                    setPlaceholderPhotoURL(photo.uri);
                    setCameraModalVisible(false);
                  }
                }}
              >
                <MaterialIcons name="circle" size={80} color={TERSIARYCOLOR} />
              </TouchableOpacity>
            </View>
          </Camera>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    height: "100%",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    margin: 20,
  },
  button: {
    position: "absolute",
    top: 0,
    left: 10,
  },
  text: {},
  header: {
    flex: 1,
    backgroundColor: PRIMARYCOLOR,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 10,
  },
  photoButton: {
    position: "absolute",
    bottom: 0,
  },
});
