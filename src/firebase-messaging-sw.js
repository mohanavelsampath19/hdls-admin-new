importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyCShvShumkNiSE613TF7AbOmnWuU2OWHXY",
  authDomain: "tribeapp-24cfc.firebaseapp.com",
  projectId: "tribeapp-24cfc",
  storageBucket: "tribeapp-24cfc.appspot.com",
  messagingSenderId: "613954042294",
  appId: "1:613954042294:web:3a97a3c7dffb4d03082917",
  measurementId: "G-WK8PP7SNXT"
});
const messaging = firebase.messaging();
const channel4Broadcast = new BroadcastChannel('channel4');

messaging.onBackgroundMessage((payload) => {
    channel4Broadcast.postMessage({payload:payload.data});
});
  
