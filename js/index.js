let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let timer;
let startTime;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let gameStarted = false; 


const cells = document.querySelectorAll(".cell");
const timerDisplay = document.getElementById("timer");
const highScoresList = document.getElementById("highScoresList");



function startGame() {
    board.fill("");
     cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.classList.remove("winner");
        cell.addEventListener("click", () => handlePlayerMove(index), { once: true });
    });

    gameStarted = false; 
    timerDisplay.textContent = "Tiempo: 0s";
}


function startTimer() {

    startTime = Date.now();
    timer = setInterval(updateTimer, 1000);
}


function updateTimer() {

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Tiempo: ${elapsed}s`;
}

function handlePlayerMove(index) {

    if  (!gameStarted) {
         gameStarted = true;
        startTimer();
    }


    if (board[index] === "") {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        if (checkWin(currentPlayer)) {
            endGame(true);
        } else if (board.every(cell => cell !== "")) {
            endGame(false);
        } else {
            currentPlayer = "O";
            computerMove();
        }
    }
}


function computerMove() {

     let emptyCells = board.map((cell, idx) => cell === "" ? idx : null).filter(idx => idx !== null);
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
     board[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;

     if (checkWin(currentPlayer)) {
        endGame(false);
    } else {
        currentPlayer = "X";
    }

}

function checkWin(player) {

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
    
}

function endGame(playerWon) {

    clearInterval(timer);

    if (playerWon) {

        const playerName = prompt("¡Ganaste! Ingresa tu nombre:");
         const time = Math.floor((Date.now() - startTime) / 1000);
         highScores.push({ name: playerName, time: time, date: new Date().toLocaleString() });
            highScores.sort((a, b) => a.time - b.time);
            highScores = highScores.slice(0, 10);
        localStorage.setItem("highScores", JSON.stringify(highScores));
    }


    displayHighScores();
    setTimeout(startGame, 2000); 
}


function displayHighScores() {

    highScoresList.innerHTML = highScores.map(score => 
         `<li>${score.name} - ${score.time}s - ${score.date}</li>`
         ).join("");
}



window.onload = () => {
    startGame();
    displayHighScores();
};
