importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyBL8_awaeTeqbw-SOJfQ_Xa3RG01NXJrvc",
  authDomain: "tribe-loyalty.firebaseapp.com",
  projectId: "tribe-loyalty",
  storageBucket: "tribe-loyalty.appspot.com",
  messagingSenderId: "632844966384",
  appId: "1:632844966384:web:9ffd535afbc456328ae535",
  measurementId: "G-QS5FXBMK86"
});
const messaging = firebase.messaging();
const channel4Broadcast = new BroadcastChannel('channel4');
messaging.onBackgroundMessage((payload) => {
    channel4Broadcast.postMessage({payload:payload.data});
});
  