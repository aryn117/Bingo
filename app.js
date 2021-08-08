'use strict'; // Use Strict Mode

//? //////  DOM Selections  ////////////////////////////////////////////////

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

//? /////////////////////////////////////////////////////////////////////////

var db = firebase.firestore();

let playerName = 'default';
let mainArray = [];
let playerSelectionArray = [];
let roomId;
let isHost;
let globalArray = [];
let playerTurn = 1;

//? ////////  Methods /////////////////////////////////////////////////
function getSplashScreenInput(e) {
  // for Event listener to buttons Only
  if (
    !e.target.classList.contains('create--room_button') &&
    !e.target.classList.contains('join--room_button')
  )
    return;
  // condition for valid name input
  if (nameInput.value === '') {
    displayMessage('Enter a valid Name', 3000);
    return;
  }
  // Condition for creating a Room
  if (e.target.classList.contains('create--room_button')) {
    roomId = Math.trunc((Math.random() + 1) * 1000);
    setRoomDocument();
    playerNameNav.textContent = playerName = nameInput.value;
    roomIdNav.textContent = roomId;
    isHost = true;

    db.collection('Bingo').doc(String(roomId)).set(
      {
        player_1: playerName,
      },
      { merge: true }
    );

    splashContainer.style.display = 'none';
    roomDocumentListener();
    return;
  }
  playerNameNav.textContent = playerName = nameInput.value;
  // condition for valid room input
  if (joinRoomInput.value === '') {
    displayMessage('Enter A Valid RoomID', 3000);
    return;
  }

  roomIdNav.textContent = roomId = joinRoomInput.value;
  isHost = false;

  db.collection('Bingo').doc(String(roomId)).set(
    {
      player_2: playerName,
    },
    { merge: true }
  );

  roomDocumentListener();
  splashContainer.style.display = 'none';
}
function fill() {
  let array_1to25 = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25,
  ];

  // resets #mainArray
  mainArray = [];

  // Loop for filling out the bingo with random numbers and placement
  let temp = [];
  for (let i = 0; i < 25; i++) {
    let index = Math.trunc(Math.random() * array_1to25.length);
    document.querySelector(`.cell-${i + 1}`).textContent = array_1to25[index];
    mainArray.push(
      Number(document.querySelector(`.cell-${i + 1}`).textContent)
    );

    array_1to25.splice(index, 1);
  }
}
function validateUserSelection(e) {
  let winner = '';
  // This method returns true/ false IF the user has made a valid choice.
  // IF a valid selection is made...the selection is .push() into playerSelectionArray
  if (
    e.target.classList.contains('cell') &&
    e.target.classList.contains('active')
  ) {
    // Round Robin

    if (isHost) {
      if (playerTurn === 2) {
        displayMessage('Please Wait For Your Turn', 2000);
        return;
      }
    }
    if (!isHost) {
      if (playerTurn === 1) {
        displayMessage('Please Wait For Your Turn', 2000);

        return;
      }
    }

    if (playerTurn == 1 && hasUserWon()) winner = 1;
    if (playerTurn == 2 && hasUserWon()) winner = 2;

    db.collection('Bingo').doc(String(roomId)).update({
      currentSelection: e.target.textContent,
      playerTurn: playerTurn,
      winner: winner,
    });

    playerSelectionArray.push(Number(e.target.textContent));

    return true;
  } else {
    displayMessage('Please make A Valid Selection', 3000);
    return false;
  }
}
function hasUserWon() {
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

  // const mainArray = mainArray;
  const selectionArray = globalArray;

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
      Index_playerSelectionArray.push(mainArray.indexOf(selectionArray[i]) + 1);
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
    return true;
  } else {
    return false;
  }
}
function winModalMessage(playerName) {
  document.querySelector('.winnerName').textContent = playerName;
  modalWindow.style.display = 'flex';
}
function displayMessage(input, interval = 2000) {
  if (messageWindow.style.display === 'flex') return;
  messageWindow.style.display = 'flex';
  messageWindow.textContent = input;
  setInterval(() => (messageWindow.style.display = 'none'), interval);
}
function pushGlobalArray(num) {
  if (num) globalArray.push(num);
}
function makeCellSelection(num) {
  document.querySelectorAll('.cell').forEach(cell => {
    if (+cell.textContent === num) cell.classList.remove('active');
  });
}
function setRoomDocument() {
  db.collection('Bingo').doc(String(roomId)).set({
    player_1: 'defaultName1',
    player_2: 'defaultName2',
    currentSelection: '',
    playerTurn: 1,
    winner: '',
  });
}
function roomDocumentListener() {
  db.collection('Bingo')
    .doc(String(roomId))
    .onSnapshot(doc => {
      document.querySelector('div.current--players_listItem_1').textContent = doc.data().player_1;
      document.querySelector('div.current--players_listItem_2').textContent = doc.data().player_2;

      if (+doc.data().winner) {
        if (+doc.data().winner === 1) winModalMessage(doc.data().player_1);
        if (+doc.data().winner === 2) winModalMessage(doc.data().player_2);
      }

      if (doc.data().currentSelection) {
        if (doc.data().playerTurn === 1) {
          playerTurn = 2;
        }

        if (doc.data().playerTurn === 2) {
          playerTurn = 1;
        }
      }
      pushGlobalArray(+doc.data().currentSelection);
      if (+doc.data().currentSelection)
        makeCellSelection(+doc.data().currentSelection);
    });
}
//? ///////////////////////////////////////////////////////////////////

splashContainer.addEventListener('click', getSplashScreenInput);
container.addEventListener('click', validateUserSelection);
fill();
