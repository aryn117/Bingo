const firebase = require('firebase');
import app from './app';
// Required for side-effects
require('firebase/firestore');

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyA_xrZBaYgCCIbxtpwWQAtB-imEUalRgiE',
  authDomain: 'bingo-a314a.firebaseapp.com',
  projectId: 'bingo-a314a',
  storageBucket: 'bingo-a314a.appspot.com',
  messagingSenderId: '1072613042990',
  appId: '1:1072613042990:web:4fb753084f7fdc7642e8bf',
  measurementId: 'G-3XY4FSC9MC',
});

var db = firebase.firestore();

db.collection('bingo')
  .doc('lounge')
  .set({ name: 'aryan' })
  .then(() => {
    console.log('Lounge was made');
  });

db.collection('bingo')
  .doc('lounge')
  .get()
  .then(doc => {
    if (!doc.exists) {
      console.log('doc not found');
    }
    {
      console.log(doc.data());
    }
  })
  .catch(err => {
    console.error('error getting document', err);
  });

  