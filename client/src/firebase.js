import { initializeApp } from "firebase/app";
import { getMessaging , getToken } from "firebase/messaging";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "https://mern-839c3-default-rtdb.firebaseio.com",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

 export const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
  const messaging = getMessaging(app);


 export const token=()=>getToken(messaging, { vapidKey: 'BG_ff9xfhUXwax2eWj-6ikGC2Mm_Mgcygj56YwkgcLZZBC4X_oX25bmroUZLxXsirFjmB5ZUlPYHF1oBYarse_I' }).then((currentToken) => {
    if (currentToken) {
      console.log(currentToken , "current Token")
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // ...
  });
  
//   onMessage(messaging, (payload) => {
//     console.log("Message received. ", payload);
//     // ...
//   });