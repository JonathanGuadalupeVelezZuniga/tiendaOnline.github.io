let rows, cols, mines, board, minePositions;
let firstMove = true;

function setDifficulty(level) {
    const difficulties = {
        facil: { rows: 5, cols: 5, mines: 5 },
        medio: { rows: 8, cols: 8, mines: 12 },
        dificil: { rows: 10, cols: 10, mines: 20 },
    };
    const config = difficulties[level];
    document.getElementById("rows").value = config.rows;
    document.getElementById("cols").value = config.cols;
    document.getElementById("mines").value = config.mines;
}

function startGame() {
    rows = parseInt(document.getElementById("rows").value);
    cols = parseInt(document.getElementById("cols").value);
    mines = parseInt(document.getElementById("mines").value);
    board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ revealed: false, mine: false, flagged: false })));
    minePositions = [];
    firstMove = true;
    
    const gameDiv = document.getElementById("game");
    gameDiv.style.gridTemplateRows = `repeat(${rows}, 40px)`;
    gameDiv.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
    gameDiv.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `${r}-${c}`;
            cell.onclick = () => revealCell(r, c);
            cell.oncontextmenu = (e) => {
                e.preventDefault();
                toggleFlag(r, c);
            };
            gameDiv.appendChild(cell);
        }
    }
}

function placeMines(safeRow, safeCol) {
    minePositions = [];
    while (minePositions.length < mines) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        
        if ((r !== safeRow || c !== safeCol) && !board[r][c].mine) {
            board[r][c].mine = true;
            minePositions.push({ r, c });
        }
    }
}

function revealCell(r, c) {
    if (board[r][c].revealed || board[r][c].flagged) return;

    if (firstMove) {
        placeMines(r, c);
        firstMove = false;
    }

    const cellElement = document.getElementById(`${r}-${c}`);
    board[r][c].revealed = true;
    cellElement.classList.add("revealed");

    if (board[r][c].mine) {
        cellElement.classList.add("mine");
        cellElement.textContent = "💣";
        alert("¡Has perdido!");
        return;
    }

    const minesAround = countMinesAround(r, c);
    cellElement.textContent = minesAround > 0 ? minesAround : "";

    if (minesAround === 0) {
        revealSurroundingCells(r, c);
    }

    checkWin();
}

function countMinesAround(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealSurroundingCells(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !board[nr][nc].revealed && !board[nr][nc].mine) {
                revealCell(nr, nc);
            }
        }
    }
}

function toggleFlag(r, c) {
    if (board[r][c].revealed) return;

    board[r][c].flagged = !board[r][c].flagged;
    const cellElement = document.getElementById(`${r}-${c}`);
    cellElement.classList.toggle("flag");
    cellElement.textContent = board[r][c].flagged ? "🚩" : "";
}

function checkWin() {
    let revealedCells = 0;
    board.forEach(row => row.forEach(cell => {
        if (cell.revealed) revealedCells++;
    }));

    if (revealedCells === rows * cols - mines) {
        alert("¡Has ganado!");
    }
}
