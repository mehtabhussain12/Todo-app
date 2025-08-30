 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
  import { getAuth} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js'
  import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyC2IpF-hh-Ou8PoYv9YJdBsi36Qlwv5m8s",
    authDomain: "todo-app-c2c17.firebaseapp.com",
    projectId: "todo-app-c2c17",
    storageBucket: "todo-app-c2c17.firebasestorage.app",
    messagingSenderId: "108946355866",
    appId: "1:108946355866:web:e93908e9c51cb2c5fd5123",
    measurementId: "G-4LV495BTFK"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);
  const analytics = getAnalytics(app);
  export {app, auth , db};