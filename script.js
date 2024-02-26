//Global Variables
let currentPlayer = "X";
const NUMBER_OF_ROWS = 4;
let gameTurns = NUMBER_OF_ROWS ** 2;
let turnsCounter = 0;
////extra feature
let playerXscore = 0;
let playerOscore = 0;

const resetBtn = document.querySelector("#reset");
const modal = document.getElementById("winModal");
const msg = document.getElementById("winMessage");
const continueBtn = document.getElementById("continue");
const closeBtn = document.getElementById("closeBtn");

const showScore = function () {
  if (currentPlayer.toUpperCase() === "X") {
    playerXscore++;
    document.getElementById("playerXScore").textContent = playerXscore;
  } else if (currentPlayer.toUpperCase() === "O") {
    playerOscore++;
    document.getElementById("playerOScore").textContent = playerOscore;
  }
};

///////////////////////////////////////////////
// create board Dynamically
const createBoardArray = function () {
  let board = [];
  for (let i = 0; i < NUMBER_OF_ROWS; i++) {
    board.push(Array.from({ length: NUMBER_OF_ROWS }, () => "_"));
  }

  console.log(board);
  return board;
};

let board = createBoardArray();

/////////////////////////////////////////
const createNewBoardAgain = function () {
  document.querySelector(".board").remove();
  createboard();
  currentPlayer = "X";
  turnsCounter = 0;
  board = createBoardArray();
};

//Modal Functionality
const closeModal = function () {
  createNewBoardAgain();
  document.querySelector("div.playerX").classList.add("playerX--active");
  document.querySelector("div.playerO").classList.remove("playerO--active");
  modal.classList.remove("show");
};

//GAme Resetting
const resetGame = function () {
  createNewBoardAgain();
  playerXscore = 0;
  playerOscore = 0;
  document.getElementById("playerXScore").textContent = 0;
  document.getElementById("playerOScore").textContent = 0;
  document.querySelector("div.playerX").classList.add("playerX--active");
  document.querySelector("div.playerO").classList.remove("playerO--active");
  modal.classList.remove("show");
};
//check if all the rows have the same mark of the current player
const checkRows = (currentPlayer) => {
  let column = 0;

  for (let row = 0; row < NUMBER_OF_ROWS; row++) {
    while (column < NUMBER_OF_ROWS) {
      if (board[row][column] !== currentPlayer) {
        column = 0;
        break;
      }
      column++;
    }
    if (column === NUMBER_OF_ROWS) {
      showScore();
      return true;
    }
  }
};

//check if all the one column cells have the same mark of the current player
const checkColumns = function (currentPlayer) {
  let row = 0;

  for (let column = 0; column < NUMBER_OF_ROWS; column++) {
    while (row < NUMBER_OF_ROWS) {
      if (board[row][column] !== currentPlayer) {
        row = 0;
        break;
      }
      row++;
    }
    if (row === NUMBER_OF_ROWS) {
      showScore();
      return true;
    }
  }
};

//check diagonals

const checkDiagonal = function (currentPlayer) {
  let cell = 0;
  while (cell < NUMBER_OF_ROWS) {
    if (board[cell][cell] !== currentPlayer) {
      cell = 0;
      break;
    }
    cell++;
  }
  if (cell === NUMBER_OF_ROWS) {
    showScore();
    return true;
  }
};

const checkReverseDiagonal = function (currentPlayer) {
  let cell = 0;
  while (cell < NUMBER_OF_ROWS) {
    if (board[cell][NUMBER_OF_ROWS - 1 - cell] !== currentPlayer) {
      cell = 0;
      break;
    }
    cell++;
  }
  if (cell === NUMBER_OF_ROWS) {
    showScore();
    return true;
  }
};

// if the current player wins

const checkWinning = (currentPlayer) => {
  if (checkRows(currentPlayer)) return true;
  if (checkColumns(currentPlayer)) return true;
  if (checkDiagonal(currentPlayer)) return true;
  if (checkReverseDiagonal(currentPlayer)) return true;
};

const showWinnerMsg = function (msg, player) {
  if (player === "X") {
    msg.style.color = " #4dfff9";
  } else if (player === "O") {
    msg.style.color = " #ffbb3c";
  }
  msg.textContent = `${player}'s Win!🎉`;
  modal.classList.add("show");
};

const runWinningEvent = function (player) {
  setTimeout(() => {
    showWinnerMsg(msg, player);
  }, 100);
};
// if the current player draws

const runDrawEvent = function () {
  setTimeout(() => {
    msg.textContent = `No one Wins!🤞`;
    modal.classList.add("show");
  }, 100);
};

const switchPlayer = function (player) {
  if (player === "X") {
    // If current player is X, switch to O
    document.querySelector("div.playerX").classList.remove("playerX--active"); // Remove active class from X
    document.querySelector("div.playerO").classList.add("playerO--active"); // Add active class to O
    player = "O"; // Switch player to O
  } else {
    // If current player is O, switch to X
    document.querySelector("div.playerO").classList.remove("playerO--active"); // Remove active class from O
    document.querySelector("div.playerX").classList.add("playerX--active"); // Add active class to X
    player = "X"; // Switch player to X
  }
  return player;
};

// board[0][0]= "x"
//Getting the Columns and Rows matrix for every cell in the board dynamically

const getCellPlace = (index, rowNumber) => {
  const row = Math.floor(index / rowNumber);
  const col = index % rowNumber;

  return [row, col];
};

//showing the X and O on the board
const showMarksDesign = function (cell, player) {
  cell.querySelector(".value").textContent = player;
  cell.classList.add(`cell--${player}`);
};

const cellClickHandler = function (event, index) {
  //place the player Mark
  const cell = event.target;
  const [row, col] = getCellPlace(index, NUMBER_OF_ROWS);
  console.log([row, col]);

  if (board[row][col] === "_") {
    turnsCounter++;
    board[row][col] = currentPlayer;
    //placing the mark with its style
    showMarksDesign(cell, currentPlayer);

    //check if the player wins
    if (checkWinning(currentPlayer)) {
      runWinningEvent(currentPlayer);
    } else {
      // else check if there is a draw
      if (turnsCounter === gameTurns) {
        runDrawEvent();
      }
      debugger;
      //else switch player
      currentPlayer = switchPlayer(currentPlayer);
    }
  }
};

////////////////////////////////////////////////
const creatingCell = function (i) {
  const cellString = `<div class="cell" role="button" tabindex= ${
    i + 1
  }><span class="value"></span></div>`;
  const cellElement = document
    .createRange()
    .createContextualFragment(cellString);
  cellElement
    .querySelector(".cell")
    .addEventListener("click", (e) => cellClickHandler(e, i));

  cellElement.querySelector(".cell").addEventListener("keydown", (e) => {
    e.key === "Enter" ? cellClickHandler(e, i) : true;
  });

  return cellElement;
};

//1- creating the board
const createboard = function () {
  const board = document.createElement("div");
  board.classList.add("board");

  // creating the 9 cells
  for (let i = 0; i < gameTurns; i++) {
    const cellElement = creatingCell(i);
    board.appendChild(cellElement);
  }

  document.documentElement.style.setProperty("--grid-rows", NUMBER_OF_ROWS);
  modal.insertAdjacentElement("beforebegin", board);
};

createboard();

resetBtn.addEventListener("click", resetGame);

//closing the Modal
continueBtn.addEventListener("click", closeModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("keydown", (event) => {
  let target = event.key;
  console.log(target);
  if (target === "Escape") closeModal();
});
