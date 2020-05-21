
let main = document.querySelector('.main');
const scoreElem = document.getElementById("score");
const levelElem = document.getElementById("level");
const nextTetroElem = document.getElementById("next-tetro");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const gameOver = document.getElementById("game-over");

let playfield = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//let playfield = Array(20).fill(Array(10).fill(0));

let score = 0;
let gameTimerID;
let currentLevel = 1;
let isPaused = true;

let possibleLevels = {
    1: {
        scorePerLine: 1,
        speed: 900,
        nextLevelScore: 25
    },
    2: {
        scorePerLine: 1,
        speed: 800,
        nextLevelScore: 50  
    },
    3: {
        scorePerLine: 1,
        speed: 700,
        nextLevelScore: 100, 
    },
    4: {
        scorePerLine: 1,
        speed: 600,
        nextLevelScore: 200, 
    },
    5: {
        scorePerLine: 1,
        speed: 500,
        nextLevelScore: 300, 
    },
    6: {
        scorePerLine: 1,
        speed: 400,
        nextLevelScore: 500, 
    },
    7: {
        scorePerLine: 1,
        speed: 300,
        nextLevelScore: 750, 
    },
    8: {
        scorePerLine: 1,
        speed: 300,
        nextLevelScore: 1000, 
    },
    9: {
        scorePerLine: 1,
        speed: 200,
        nextLevelScore: Infinity, 
    },
};

let figures = {
    O: [
        [1, 1],
        [1, 1],
    ],

    I: [
        [0, 0, 0, 0], 
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],

    S: [
        [0, 1, 1], 
        [1, 1, 0],
        [0, 0, 0],
    ],

    Z: [
        [1, 1, 0], 
        [0, 1, 1],
        [0, 0, 0],
    ],

    J: [
        [1, 0, 0], 
        [1, 1, 1],
        [0, 0, 0],
    ],

    L: [
        [0, 0, 1], 
        [1, 1, 1],
        [0, 0, 0],
    ],

    T: [
        [1, 1, 1], 
        [0, 1, 0],
        [0, 0, 0], 
    ],
}


let activeTetro = getNewTetro();
let nextTetro = getNewTetro();

function draw() {
let mainInnerHTML = "";
for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) {
        if (playfield[y][x] === 1) {
            mainInnerHTML += '<div class="cell movingCell"></div>';
        } else if(playfield[y][x] === 2) {
            mainInnerHTML += '<div class="cell fixedCell"></div>';
        } else {
            mainInnerHTML += '<div class="cell"></div>';
    }
}
}
main.innerHTML = mainInnerHTML;
}

function drawNextTetro() {
    let nextTetroInnerHTML = "";
    for (let y = 0; y < nextTetro.shape.length; y++) {
        for (let x = 0; x < nextTetro.shape[y].length; x++) {
           if (nextTetro.shape[y][x]) {
            nextTetroInnerHTML += '<div class="cell movingCell"></div>'
           } else {
            nextTetroInnerHTML += '<div class="cell"></div>';
           }
        }
        nextTetroInnerHTML += '<br/>'
    }
    nextTetroElem.innerHTML = nextTetroInnerHTML;
}

function removePrevActiveTetro () {
    for (let y = 0; y < playfield.length; y++) {
        for (let x = 0; x < playfield[y].length; x++) {
            if (playfield [y][x] === 1) {
                playfield [y][x] = 0;
            }
        }
    }
}

function addActiveTetro () {
    removePrevActiveTetro();
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x]) {
                playfield[activeTetro.y + y][activeTetro.x + x] = activeTetro.shape[y][x];
            }
        }
    }
}

function rotateTetro () {
    const prevTetroState = activeTetro.shape;

    activeTetro.shape = activeTetro.shape[0].map((val, index) =>
    activeTetro.shape.map((row) => row [index]).reverse()
  );

  if ( hasCollisions() ) {
    activeTetro.shape = prevTetroState;
  }
}

function hasCollisions () {
    for (let y = 0; y < activeTetro.shape.length; y++) {
        for (let x = 0; x < activeTetro.shape[y].length; x++) {
            if (activeTetro.shape[y][x] && 
            (playfield [activeTetro.y + y] === undefined ||
             playfield[activeTetro.y + y][activeTetro.x + x] === undefined ||
             playfield[activeTetro.y + y][activeTetro.x + x] === 2)  
            ) {
                return true;
            }
        }
            }
            return false;
        }
    
// function canTetroMoveDown() {
//     for (let y = 1; y < playfield.length; y++) {
//         for (let x = 0; x < playfield[y].length; x++) {
//         if (playfield[y][x] === 1) {
//             if (y === playfield.length - 1 || playfield[y + 1][x] === 2) {
//                 return false;
//             }
//         }
//         }
//     }
//     return true;
// }

// function moveTetroDown() {
//     if ( canTetroMoveDown() ){
//     for (let y = playfield.length - 1; y >= 0; y--) {
//         for (let x = 0; x < playfield[y].length; x++) {
//             if(playfield[y][x] === 1) {
//                 playfield[y + 1][x] = 1;
//                 playfield[y][x] = 0;
//             }
//         }
//     }
// } else {
//     fixTetro();
// }
// }

// To the left
// function canTetroMoveLeft() {
//     for (let y = 0; y < playfield.length; y++) {
//         for (let x = 0; x < playfield[y].length; x++) {
//         if (playfield[y][x] === 1) {
//             if (x === 0 || playfield[y][x - 1] === 2) {
//                 return false;
//             }
//         }
//         }
//     }
//     return true;
// }

// function moveTetroLeft() {
//     if ( canTetroMoveLeft() ) {
//     for (let y = playfield.length - 1; y >= 0; y--) {
//         for (let x = 0; x < playfield[y].length; x++) {
//             if(playfield[y][x] === 1) {
//                 playfield[y][x - 1] = 1;
//                 playfield[y][x] = 0;
//             }
//         }
//     }
// }
// }

// To the right
// function canTetroMoveRight() {
//     for (let y = 0; y < playfield.length; y++) {
//         for (let x = 0; x < playfield[y].length; x++) {
//         if (playfield[y][x] === 1) {
//             if (x === 9 || playfield[y][x + 1] === 2) {
//                 return false;
//             }
//         }
//         }
//     }
//     return true;
// }

// function moveTetroRight() {
//     if ( canTetroMoveRight() ) {
//     for (let y = playfield.length - 1; y >= 0; y--) {
//         for (let x = 9; x >= 0; x--) {
//             if(playfield[y][x] === 1) {
//                 playfield[y][x + 1] = 1;
//                 playfield[y][x] = 0;
//             }
//         }
       
// }
// }
// }


function removeFullLines() {
    let canRemoveLine = true, 
        filledLines = 0;
    for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) { 
            if(playfield[y][x] !==2) {
                canRemoveLine = false;
                break;
            }
        }
        if(canRemoveLine) {
            playfield.splice(y, 1);
            playfield.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            filledLines += 1;
        }
        canRemoveLine = true;
    }

       switch (filledLines) {
        case 1:
            score += possibleLevels[currentLevel].scorePerLine;
          break;
        case 2:
            score += possibleLevels[currentLevel].scorePerLine * 3;
          break;
        case 3:
            score += possibleLevels[currentLevel].scorePerLine * 5;
          break;
        case 4:
            score += possibleLevels[currentLevel].scorePerLine * 7;
          break;
    
    }
   
    scoreElem.innerHTML = score; 

    if(score >= possibleLevels[currentLevel].nextLevelScore) {
        currentLevel++;
        levelElem.innerHTML = currentLevel;
    }
}

function getNewTetro() {
    const possibleFigures = 'IOLJTSZ';
    const rand = Math.floor(Math.random() * 7);
    const newTetro = figures[possibleFigures[rand]];

    return {
    x: Math.floor((10 - newTetro[0].length) / 2),
    y: 0,
    shape: newTetro,
    };
}

function fixTetro() {
    for (let y = 0; y < playfield.length; y++) {
    for (let x = 0; x < playfield[y].length; x++) { 
        if(playfield[y][x] === 1) {
            playfield[y][x] = 2;
}
}
}
}

function moveTetroDown() {

         activeTetro.y += 1;
         if ( hasCollisions () ) {
            activeTetro.y -= 1;
            fixTetro();
            removeFullLines();
            activeTetro = nextTetro;
            if ( hasCollisions() ) {
              
              //alert('Game over');
              reset();
            }
            nextTetro = getNewTetro();
}   
    }


function dropTetro() {
    for (let y = activeTetro.y; y < playfield.length; y++) {
        activeTetro.y += 1;
        if ( hasCollisions() ) {
            activeTetro.y -= 1;
            break;
        }
        
    }
}

function reset() {
    isPaused = true;
    clearTimeout(gameTimerID);
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    draw();
    gameOver.style.display = 'block';
}

document.onkeydown = function (e) {
    if (!isPaused) {
    if (e.keyCode === 37) {
        activeTetro.x -=1;
        if ( hasCollisions() ) {
            activeTetro.x +=1;
        }
        // Двигаем фигурку влево
    } else if (e.keyCode === 39) {
        activeTetro.x +=1;
        if ( hasCollisions() ) {
            activeTetro.x -=1;
        }
        // Двигаем фигурку вправо
    } else if (e.keyCode === 40) {
       moveTetroDown ();
        // Speed down
    } else if (e.keyCode === 38) {
       rotateTetro();
    } else if (e.keyCode === 32) {
        dropTetro();
    }
    updateGameState();
  } 
};

function updateGameState () {
    if(!isPaused) {
    addActiveTetro ();
    draw ();
    drawNextTetro();
    }
}

pauseBtn.addEventListener("click", (e) => {
    if(e.target.innerHTML === 'Pause') {
        e.target.innerHTML = 'Play'
        clearTimeout(gameTimerID);
    } else {
        e.target.innerHTML = 'Pause';
        gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
    isPaused = !isPaused;
});

startBtn.addEventListener('click', e => {
    isPaused = false;
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    gameOver.style.display = 'none';
});

scoreElem.innerHTML = score;
levelElem.innerHTML = currentLevel;

draw();

function startGame() {
    moveTetroDown();
  if (!isPaused) {
    updateGameState();
    gameTimerID = setTimeout(startGame, possibleLevels[currentLevel].speed);
    }
   
  }

//setTimeout(startGame, possibleLevels[currentLevel].speed); 