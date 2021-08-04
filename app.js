'use strict';


const container = document.querySelector('.container');

const roomID = document.querySelector('.room--input_field');
const roomButton = document.querySelector('.room--input_button');
const playerName = document.querySelector('.playerName');
const newGame = document.querySelector('.random--create');

const modalWindow = document.querySelector('.modal');
const modalWinner = document.querySelector('.modal--winner');
const messageWindow = document.querySelector('.display--message');

// const io = require('socket.io-client');

class Bingo {
  #MainArray = [];
  #playerSelectionArray = [];

  //? ////////////////////////////////////////////////////

  constructor(playerName) {
    //server

    this.playerName = playerName;

    //reload game on clicking NEW GAME button
    newGame.addEventListener('click', () => window.location.reload());
    this._play();

  }
  //? ////////////////////////////////////////////////////

  _play() {
    // Set Player Name
    playerName.textContent = this.playerName;

    //Fill bingo
    this._fill();

    this._displayMessage('Hello');

    // Validate User Selection
    container.addEventListener('click', this._validateUserSelection.bind(this));
  }

  //? ////////////////////////////////////////////////////

  _fill() {
    let bingoArray = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25,
    ];

    this.#MainArray = []; // Clears the player array of any previous entries

    // Loop for filling out the bingo with random numbers and placement
    let temp = [];
    for (let i = 0; i < 25; i++) {
      let index = Math.trunc(Math.random() * bingoArray.length);
      document.querySelector(`.cell-${i + 1}`).textContent = bingoArray[index];
      this.#MainArray.push(
        Number(document.querySelector(`.cell-${i + 1}`).textContent)
      );

      bingoArray.splice(index, 1);
    }
  }

  //? ////////////////////////////////////////////////////

  _validateUserSelection(e) {
    let validSelectionMade = false;
    while (!validSelectionMade) {
      if (
        !e.target.classList.contains('cell') &&
        !e.target.classList.contains('active')
      )
        return;
      this.#playerSelectionArray.push(Number(e.target.textContent));
      e.target.classList.remove('active');
      validSelectionMade = true;
    }

    // After (if) the user selection is validated,_hasUserWon() checks if the user has won the game
    this._hasUserWon();
  }

  //? ////////////////////////////////////////////////////

  _hasUserWon() {
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

    // Horizontal Test
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 1, 2, 3, 4, 5)) {
      linesCompleted++;
      console.log('[1,2,3,4,5] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 6, 7, 8, 9, 10)) {
      linesCompleted++;
      console.log('[6,7,8,9,10] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 11, 12, 13, 14, 15)) {
      linesCompleted++;
      console.log('[11,12,13,14,15] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 16, 17, 18, 19, 20)) {
      linesCompleted++;
      console.log('[16,17,18,19,20] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 21, 22, 23, 24, 25)) {
      {
        linesCompleted++;
        console.log('[20,21,22,23,24,25] is passed');
      }
    }
    //Vertical Test
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 1, 6, 11, 16, 21)) {
      linesCompleted++;
      console.log('[1,6,11,16,21] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 2, 7, 12, 17, 22)) {
      linesCompleted++;
      console.log('[6,7,12,17,22] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 3, 8, 13, 18, 23)) {
      linesCompleted++;
      console.log('[11,8,13,18,23] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 4, 9, 14, 19, 24)) {
      linesCompleted++;
      console.log('[4,9,14,19,24] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 5, 10, 15, 20, 25)) {
      linesCompleted++;
      console.log('[5,10,15,20,25] is passed');
    }

    // Diagonal Test

    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 1, 7, 13, 19, 25)) {
      linesCompleted++;
      console.log('[1,7,13,19,25] is passed');
    }
    if (arrIncHelper(iOfPSA(mainArray, selectionArray), 5, 9, 13, 17, 21)) {
      linesCompleted++;
      console.log('[5,9,13,17,21] is passed');
    }

    //! //////////////////////////////////////////////////////////////////
    if (Number(linesCompleted) >= 5) this._onWinning();
  }

  _onWinning() {
    console.log(modalWindow);
    modalWindow.style.display = 'flex';
  }

  _displayMessage(inp) {
    console.log('called');
    messageWindow.style.display = 'flex';
    messageWindow.textContent = inp;
    setInterval(() => (messageWindow.style.display = 'none'), 3000);
  }
}

const aru = new Bingo('Aryan');
