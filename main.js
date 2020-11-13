// CREATE CANVAS
let canvas = document.createElement("canvas");
let w = 450;
let h = 450;
canvas.setAttribute("height", h);
canvas.setAttribute("width", w);

// APPEND CANVAS TO DOCUMENT
let container = document.body;
container.appendChild(canvas);

// SET GAME DEFAULTS
let cellSize = 15;
let cellsPerSecond = 10;
let snake = [];
let food = {};
let direction = "right";
let score = 0;
let interval;

// GET CANVAS CONTEXT
let ctx = canvas.getContext("2d");
ctx.font = `${cellSize - Math.round(cellSize / 3)}px sans-serif`;

// INITIALIZE GAME
init();

function init() {
  // CREATE GAME ENTITIES
  snake = createSnake();
  food = createFood();

  // PAINT FIRST FRAME
  paintFrame();

  // SET UP GAME TICKS BASED ON DESIRED SPEED OF THE SNAKE
  interval = setInterval(tick, 1000 / cellsPerSecond);
}

function tick() {
  // GET FRONT CELL OF SNAKE
  let head = {
    x: snake[0].x,
    y: snake[0].y
  };

  // CHECK IF SNAKE HAS HIT THE EDGE
  if (
    head.x === -1 ||
    head.y === -1 ||
    head.x === w / cellSize ||
    head.y === h / cellSize
  ) {
    // 2 OPTIONS:

    // GAME OVER
    // clearInterval(interval);
    // return;

    // WRAP MOVEMENT AROUND AXIS
    if (direction === "right") {
      head.x = 0;
    } else if (direction === "left") {
      head.x = Math.round(w / cellSize) - 1;
    } else if (direction === "up") {
      head.y = Math.round(h / cellSize) - 1;
    } else if (direction === "down") {
      head.y = 0;
    }

  } else {

    // APPLY DIRECTIONAL MOTION
    if (direction === "right") {
      head.x = head.x + 1;
    } else if (direction === "left") {
      head.x = head.x - 1;
    } else if (direction === "up") {
      head.y = head.y - 1;
    } else if (direction === "down") {
      head.y = head.y + 1;
    }
  }

  // ADD DIRECTIONAL MOTION TO FRONT CELL OF SNAKE
  snake.unshift(head);

  // CHECK IF PLAYER HAS GRABBED FOOD
  if (head.x === food.x && head.y === food.y) {
    score = score + 1;
    food = createFood();
  } else {
    // REMOVE LAST CELL OF SNAKE
    snake.pop();
  }

  // PAINT GAME ENTITIES
  paintFrame();
}

function createSnake() {
  let results = [];
  for (let i = 4; i >= 0; i--) {
    results.push({
      x: i,
      y: 0
    });
  }
  return results;
}

function random(min, max) {
  return Math.round(Math.random() * (max - min) / min);
}

function createFood() {
  return {
    x: random(cellSize, w),
    y: random(cellSize, h)
  };
}

function paintCell(c, color) {
  ctx.fillStyle = color;
  ctx.fillRect(c.x * cellSize, c.y * cellSize, cellSize, cellSize);
  ctx.strokeStyle = "white";
  ctx.strokeRect(c.x * cellSize, c.y * cellSize, cellSize, cellSize);
}

function paintFrame() {
  // PAINT BACKGROUND
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, w, h);

  // PAINT SNAKE
  snake.forEach((cell) => paintCell(cell, "blue"));

  // PAINT FOOD
  paintCell(food, "red");

  // PAINT SCORE
  // ctx.strokeText("Score: " + score, Math.round(cellSize / 3), h - Math.round(cellSize / 3));
  // ctx.fillText("Score: " + score, Math.round(cellSize / 3), h - Math.round(cellSize / 3));

}

// HANDLE KEY EVENT LISTENER
keyEvent(function(code) {
  if (code === 37 || code === 65) { // Left arrow or A
    direction = "left";
  } else if (code === 38 || code === 87) { // Up arrow or W
    direction = "up";
  } else if (code === 39 || code == 68) { // Right arrow or D
    direction = "right";
  } else if (code === 40 || code == 83) { // Down arrow or S
    direction = "down";
  }
});

function keyEvent(fn) {
  document.addEventListener("keydown", function(e) {
    fn(e.keyCode);
  });
}