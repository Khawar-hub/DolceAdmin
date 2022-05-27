import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAT2w6-IY0J7bZ5ORlapN6NUr7t65x4a4Y",
  authDomain: "dolcedays-6a18d.firebaseapp.com",
  projectId: "dolcedays-6a18d",
  storageBucket: "dolcedays-6a18d.appspot.com",
  messagingSenderId: "443294078201",
  appId: "1:443294078201:web:f065d9b12235aab47a3e28"
};

firebase.initializeApp(firebaseConfig);

export { firebase };
