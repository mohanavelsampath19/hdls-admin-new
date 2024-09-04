// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://192.168.1.2/',
  imageUrl: 'https://cloud.tribeloyalty.my/upload',
  socketUrl: '',
  // imageUrl: 'http://localhost:5000/upload'
  firebase:{
    apiKey: "AIzaSyCShvShumkNiSE613TF7AbOmnWuU2OWHXY",
  authDomain: "tribeapp-24cfc.firebaseapp.com",
  projectId: "tribeapp-24cfc",
  storageBucket: "tribeapp-24cfc.appspot.com",
  messagingSenderId: "613954042294",
  appId: "1:613954042294:web:3a97a3c7dffb4d03082917",
  measurementId: "G-WK8PP7SNXT"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
