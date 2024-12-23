// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost/',
  imageUrl: 'https://cloud.tribeloyalty.my/upload',
  socketUrl: '',
  // imageUrl: 'http://localhost:5000/upload'
  firebase:{
    apiKey: "AIzaSyBL8_awaeTeqbw-SOJfQ_Xa3RG01NXJrvc",
  authDomain: "tribe-loyalty.firebaseapp.com",
  projectId: "tribe-loyalty",
  storageBucket: "tribe-loyalty.appspot.com",
  messagingSenderId: "632844966384",
  appId: "1:632844966384:web:9ffd535afbc456328ae535",
  measurementId: "G-QS5FXBMK86"
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
