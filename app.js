document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const scoreDisplay = document.querySelector('#score');
  const linesDisplay = document.querySelector('#lines');
  const startBtn = document.querySelector('#start-button');
  const resetBtn = document.querySelector('#reset');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let lines = 0;
  //assigns a div for the "game over" text and appends it to the grid when the condition happens
  const gameOverTxt = document.createElement('div');
  gameOverTxt.id = 'gameover';
  grid.appendChild(gameOverTxt);
  gameOverTxt.classList.add('no-display');

  const colors = [
    '#ffd93a', //gold
    '#f4854e', //coral
    '#ff70cf', //hotpink
    '#b966ff', //mediumorchid
    '#00cdff', //deepskyblue
    '#05ffa1' //meediumspringgreen
  ];
  //The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2],
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2]
  ];
  const zTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
  ]
  //reversed z tetromino
  const zrTetromino = [
    [width, width+1, width*2+1, width*2+2],
    [1, width, width+1, width*2],
    [width, width+1, width*2+1, width*2+2],
    [1, width, width+1, width*2]
  ];
  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ];
  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ];
  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ];
  const theTetrominoes = [lTetromino, zTetromino, zrTetromino, tTetromino, oTetromino, iTetromino];
  let currentPosition = 4;
  let currentRotation = 0;
//randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

//draw the tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    })
  }

//remove the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    })
  }

//assign function to keyCodes
function control(e) {
  if(e.keyCode === 37){
    moveLeft();
  } else if(e.keyCode === 38){
    rotate();
  } else if(e.keyCode === 39){
    moveRight();
  } else if (e.keyCode === 40){
    moveDown();
  }
}

// the classical behavior is to speed up the block if down button is kept pressed so doing that
//document.addEventListener('keydown', control)

//move down function
function moveDown(){
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

//freeze function
function freeze() {
  if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'));
  //start a new tetromino falling
  random = nextRandom;
  nextRandom = Math.floor(Math.random() * theTetrominoes.length);
  current = theTetrominoes[random][currentRotation];
  currentPosition = 4;
  draw();
  displayShape();
  addScore();
  gameOver();
  }
}

//move the tetromino left , unless is at the edge or there is a blockage
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
  if(!isAtLeftEdge) currentPosition -=1;
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition +=1;
  }
  draw();
}

//move the tetromino right , unless is at the edge or there is a blockage
function moveRight() {
  undraw();
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
  if(!isAtRightEdge) currentPosition +=1;
if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
  currentPosition -=1;
  }
  draw();
}

//rotate the Tetromino
function rotate() {
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
  //fixed the shape split at edge
  if(!isAtLeftEdge && !isAtRightEdge){
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;  //if the current rotation gets to 4, makes it go back to 0
    }
    current = theTetrominoes[random][currentRotation];
    draw();
    }
}

//show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
const displayIndex = 0;

//the Tetrominoes without rotation
const upNextTetrominoes = [
  [displayWidth, displayWidth*2, displayWidth*2+1, displayWidth*2+2], //lTetromino
  [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1], //zTetromino
  [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2], //zrTetromino
  [displayWidth+1, displayWidth*2, displayWidth*2+1, displayWidth*2+2], //tTetromino
  [displayWidth, displayWidth+1, displayWidth*2, displayWidth*2+1], //oTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
];

//show the shape in the mini-grid display
function displayShape() {
  //remove any trace of a tetromino for the entire grid
  displaySquares.forEach( square => {
    square.classList.remove('tetromino');
    square.style.backgroundColor = '';
  })
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino');
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
  })
}

//add functionality to the start/pause button
startBtn.addEventListener('click', () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    // the classical behavior is to speed up the block if down button is kept pressed so doing that
    document.addEventListener('keydown', control);
    let savedRandom = nextRandom; //prevents changing of the next tetromino displayed
    draw();
    timerId = setInterval(moveDown, 1000);
    if (nextRandom = 0) {
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    } else{
      nextRandom = savedRandom;
      }
    displayShape();
  }
})

//add functionality to the reset button
resetBtn.addEventListener('click', () => {
    undraw();
    grid.appendChild(gameOverTxt);
    clearInterval(timerId);
    timerId = null;
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundColor = '';
      })
    }
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
      square.classList.remove('taken');
      square.style.backgroundColor = '';
    })
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    gameOverTxt.innerHTML = '';
    grid.removeChild(gameOverTxt);
    scoreDisplay.innerHTML = 0;
    linesDisplay.innerHTML = 0;
})

//add score
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
    if(row.every(index => squares[index].classList.contains('taken'))) {
      score +=10;
      scoreDisplay.innerHTML = score;
      lines +=1;
      linesDisplay.innerHTML = lines;
      undraw();
      row.forEach(index => {
        squares[index].classList.remove('taken');
        squares[index].classList.remove('tetromino');
        squares[index].style.backgroundColor = '';
      })
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell));
      draw();
    }
  }
}

//game over
function gameOver() {
  if(current.some(index =>
    squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end';
      grid.appendChild(gameOverTxt);
      gameOverTxt.innerHTML = '<h3>GAME OVER</h3>';
      gameOverTxt.classList.remove('no-display');
      gameOverTxt.classList.add('on-display');
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        })
      }
      clearInterval(timerId);
      document.removeEventListener('keydown', control);
    }
}
  
});
