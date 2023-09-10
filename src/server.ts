import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getDatabase,
  set,
  ref as databaseRef,
  onValue,
} from "firebase/database";
import { API_KEY, APP_ID, AUTH_DOMAIN, DATABASE_URL, MEASUREMENT_ID, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from "./secrets";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain:AUTH_DOMAIN,
  databaseURL:DATABASE_URL ,
  projectId:PROJECT_ID ,
  storageBucket:STORAGE_BUCKET,
  messagingSenderId:MESSAGING_SENDER_ID ,
  appId:APP_ID ,
  measurementId:MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const storageRef = ref(storage);
const profileImagesRef = ref(storageRef, "profileImages");
export const database = getDatabase(app);
export default auth;

export async function uploadImageToFirebase(
  base64String: string,
  userID: string | undefined
): Promise<string> {
  try {
    // Generate a unique filename for the image
    const filename = `${userID}.jpg`;
    // Create a reference to the file to be uploaded
    const imageRef = ref(profileImagesRef, filename);
    // Convert the Base64 string to a Blob
    const response = await fetch(base64String);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(imageRef, blob).then(() => {
      // console.log("Successfully uploaded image!");
    });
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.log("Error uploading image:", error);
  }
  return "";
}

export async function setDataToRealtimeDB(
  userID: string,
  username: string,
  wins: number,
  losses: number,
  pfpUrl: string
) {
  // console.log("setted data");
  set(databaseRef(database, `users/${userID}`), {
    username: username,
    wins: wins,
    losses: losses,
    games: wins + losses,
    pfpUrl: pfpUrl,
  });
  return Promise;
}
