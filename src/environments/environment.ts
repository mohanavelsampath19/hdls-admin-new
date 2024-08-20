// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://192.168.1.2/',
  imageUrl: 'http://cloud.tribeloyalty.my/upload',
  socketUrl: '',
  // imageUrl: 'http://localhost:5000/upload'
  firebase:{
    apiKey: "AIzaSyAWVqEisgsNdryoP_57ijROoaf5kdJyZmU",
  authDomain: "senicttech-a8632.firebaseapp.com",
  projectId: "senicttech-a8632",
  storageBucket: "senicttech-a8632.appspot.com",
  messagingSenderId: "785352023555",
  appId: "1:785352023555:web:2012a8810e13360e02b836",
  measurementId: "G-CWM7NNKR90"
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
