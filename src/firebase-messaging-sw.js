importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
    apiKey: "AIzaSyAWVqEisgsNdryoP_57ijROoaf5kdJyZmU",
  authDomain: "senicttech-a8632.firebaseapp.com",
  projectId: "senicttech-a8632",
  storageBucket: "senicttech-a8632.appspot.com",
  messagingSenderId: "785352023555",
  appId: "1:785352023555:web:2012a8810e13360e02b836",
  measurementId: "G-CWM7NNKR90"
});
const messaging = firebase.messaging();
const channel4Broadcast = new BroadcastChannel('channel4');

messaging.onBackgroundMessage((payload) => {
    channel4Broadcast.postMessage({payload:payload.data});
});
  
