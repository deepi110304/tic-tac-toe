const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],  // rows
  [0,3,6], [1,4,7], [2,5,8],  // columns
  [0,4,8], [2,4,6]            // diagonals
];

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (!gameActive || board[index]) return;

  makeMove(index, "X");

  if (!gameActive) return;

  setTimeout(() => {
    const aiMove = getBestMove();
    makeMove(aiMove, "O");
  }, 500);
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  if (checkWin(player)) {
    statusText.textContent = `${player} wins! 🎉`;
    gameActive = false;
    sendResult(`${player} wins`);
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "Draw!";
    gameActive = false;
    sendResult("Draw");
  } else {
    currentPlayer = player === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
  }
}

function checkWin(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function getBestMove() {
  // AI uses basic strategy (pick center, then corners, then sides)
  const emptyCells = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  
  // 1. Try to win
  for (let i of emptyCells) {
    board[i] = "O";
    if (checkWin("O")) {
      board[i] = "";
      return i;
    }
    board[i] = "";
  }

  // 2. Block player win
  for (let i of emptyCells) {
    board[i] = "X";
    if (checkWin("X")) {
      board[i] = "";
      return i;
    }
    board[i] = "";
  }

  // 3. Take center
  if (board[4] === "") return 4;

  // 4. Take corners
  const corners = [0, 2, 6, 8].filter(i => board[i] === "");
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Take sides
  const sides = [1, 3, 5, 7].filter(i => board[i] === "");
  return sides[Math.floor(Math.random() * sides.length)];
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `${currentPlayer}'s turn`;
}

function sendResult(result) {
  fetch("/result", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ result })
  });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", resetGame);
statusText.textContent = `${currentPlayer}'s turn`;
