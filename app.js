'use strict'; // Use Strict Mode

//? Selections ////////////////////////////////////////////

//Splash Screen
const splashContainer = document.querySelector('.splash_container');
const nameInput = document.querySelector('.name--input');
const createRoomButton = document.querySelector('.create--room_button');
const joinRoomInput = document.querySelector('.join--room_input');
const joinRoomButton = document.querySelector('.join--room_button');
//Navbar
const playerNameNav = document.querySelector('.player--name_nav');
const roomIdNav = document.querySelector('.room--id_nav');
// Main Container
const container = document.querySelector('.container');

// On winning Modal
const modalWindow = document.querySelector('.modal');
const modalWinner = document.querySelector('.modal--winner');
const messageWindow = document.querySelector('.display--message');

class Bingo {
  #playerName = 'default';
  #MainArray = [];
  #playerSelectionArray = [];
  #roomId;

  //? ////////////////////////////////////////////////////

  constructor() {
    this._fill();
    // Splash Screen Input EventListener
    splashContainer.addEventListener(
      'click',
      this._getSplashScreenInput.bind(this)
    );

    // Validate User Selection
    container.addEventListener('click', this._validateUserSelection.bind(this));
  }
  //? ////////////////////////////////////////////////////
  _getSplashScreenInput(e) {
    // for Event listener to buttons Only
    if (
      !e.target.classList.contains('create--room_button') &&
      !e.target.classList.contains('join--room_button')
    )
      return;
    // condition for valid name input
    if (nameInput.value === '') {
      this._displayMessage('Enter a valid Name', 3000);
      return;
    }
    // Condition for creating a Room
    if (e.target.classList.contains('create--room_button')) {
      playerNameNav.textContent = this.#playerName = nameInput.value;
      roomIdNav.textContent = this.#roomId = Math.trunc(
        Math.random() * 1000000 + 1
      );
      splashContainer.style.display = 'none';
      return;
    }
    playerNameNav.textContent = this.#playerName = nameInput.value;
    // condition for valid room input
    if (joinRoomInput.value === '') {
      this._displayMessage('Enter A Valid RoomID', 3000);
      return;
    }
    roomIdNav.textContent = this.#roomId = joinRoomInput.value;
    splashContainer.style.display = 'none';
  }
  //? ////////////////////////////////////////////////////

  // this generates the random pattern for the numbers, .push() to #mainArray

  _fill() {
    let array_1to25 = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ];

    // resets #mainArray
    this.#MainArray = [];

    // Loop for filling out the bingo with random numbers and placement
    let temp = [];
    for (let i = 0; i < 25; i++) {
      let index = Math.trunc(Math.random() * array_1to25.length);
      document.querySelector(`.cell-${i + 1}`).textContent = array_1to25[index];
      this.#MainArray.push(
        Number(document.querySelector(`.cell-${i + 1}`).textContent)
      );

      array_1to25.splice(index, 1);
    }
  }

  //? ////////////////////////////////////////////////////

  // This method returns true/ false IF the user has made a valid choice.
  // IF a valid selection is made...the selection is .push() into playerSelectionArray
  _validateUserSelection(e) {
    if (
      e.target.classList.contains('cell') &&
      e.target.classList.contains('active')
    ) {
      this.#playerSelectionArray.push(Number(e.target.textContent));
      e.target.classList.remove('active');
      return true;
    } else {
      this._displayMessage('Please make A Valid Selection', 3000);
      return false;
    }
  }

  _hasUserWon() {
    //? this function updates the playerSelectionArray with the number
    //? user has chosen, it also checks if the user has won

    //* this function's  return values are like this:---

    //? IF the player has completed 5 or more lines then the return value is:-
    //* [true, mainArray, selectionArray,Index_selectionArray]

    //? true ----> player has completed 5 or more lines and has won
    //? mainArray ---> the array of numbers provided to the player
    //? selectionArray ---> the numbers the player has selected
    //? Index_selectionArray ---> index of all the numbers the players has selected
    //?                            according to mainArray.

    const mainArray = this.#MainArray;
    const selectionArray = this.#playerSelectionArray;

    // Helper Function that accepts an array and arbitrary number
    // of arguments and validates if all the arguments are included in
    // the array (return BOOLEAN VALUE)
    const arrIncHelper = function (array, ...arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!array.includes(arr[i])) return false;
      }
      return true;
    };

    // Helper Function for Calculating Index of Elements that the player
    // has selected, in the #playerArray

    const iOfPSA = function (mainArray, selectionArray) {
      let Index_playerSelectionArray = [];

      for (let i = 0; i < selectionArray.length; i++) {
        Index_playerSelectionArray.push(
          mainArray.indexOf(selectionArray[i]) + 1
        );
      }
      return Index_playerSelectionArray;
    };

    let linesCompleted = 0;

    //! TESTS ///////////////////////////////////////////////////////////

    // Horizontal Lines Test
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 1, 2, 3, 4, 5))
      linesCompleted++;
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 6, 7, 8, 9, 10))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 11, 12, 13, 14, 15))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 16, 17, 18, 19, 20))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 21, 22, 23, 24, 25))
      linesCompleted++;

    // Vertical Lines Test
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 1, 6, 11, 16, 21))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 2, 7, 12, 17, 22))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 3, 8, 13, 18, 23))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 4, 9, 14, 19, 24))
      linesCompleted++;

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 5, 10, 15, 20, 25))
      linesCompleted++;

    // Diagonal Lines Test

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 1, 7, 13, 19, 25))
      linesCompleted++;
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 5, 9, 13, 17, 21))
      linesCompleted++;

    //! //////////////////////////////////////////////////////////////////

    if (Number(linesCompleted) >= 5) {
      return [
        true,
        mainArray,
        selectionArray,
        iOfPSA(mainArray, selectionArray),
      ];
    } else {
      return [
        true,
        mainArray,
        selectionArray,
        iOfPSA(mainArray, selectionArray),
      ];
    }
  }

  _winModalMessage() {
    console.log(modalWindow);
    modalWindow.style.display = 'flex';
  }

  _displayMessage(input, interval = 2000) {
    if (messageWindow.style.display === 'flex') return;
    messageWindow.style.display = 'flex';
    messageWindow.textContent = input;
    setInterval(() => (messageWindow.style.display = 'none'), interval);
  }
}

const aru = new Bingo('Aryan');



/////////////////////////
/* server */


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
  .set({ name: {playerNameNav} })
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
