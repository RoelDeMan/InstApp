'use strict';


import * as firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyCThBLTpwv_aIJi7f5PlAJQEQ9f5ZsYkfI",
    authDomain: "fir-functionstest-ab973.firebaseapp.com",
    databaseURL: "https://fir-functionstest-ab973.firebaseio.com",
    storageBucket: "fir-functionstest-ab973.appspot.com"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);

module.exports = firebaseApp;
