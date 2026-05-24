import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyANqn5SNvO9ZGuUzuT15aDqh3tc6qH8Mn4",
  authDomain: "iot-project-29231.firebaseapp.com",
  databaseURL: "https://iot-project-29231-default-rtdb.firebaseio.com",
  projectId: "iot-project-29231",
  storageBucket: "iot-project-29231.firebasestorage.app",
  messagingSenderId: "104185596211",
  appId: "1:104185596211:web:7618fdbe924d96d7fe9646",
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
