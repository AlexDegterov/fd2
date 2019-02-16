firebase.initializeApp({
    apiKey: "AIzaSyC2tiCYfuvgmStlX0HVT_wBdOnjv4YyOm0",
    authDomain: "sea-batle-763c0.firebaseapp.com",
    databaseURL: "https://sea-batle-763c0.firebaseio.com",
    projectId: "sea-batle-763c0",
    storageBucket: "sea-batle-763c0.appspot.com",
    messagingSenderId: "319065461247"
});

const myAppDB = firebase.firestore();

myAppDB.settings({
    timestampsInSnapshots: true
});