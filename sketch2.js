const r = require("raylib");

const snakeInitialPositonX = 200;
const snakeInitialPositonY = 300;

let x = [snakeInitialPositonX];
let y = [snakeInitialPositonY];

const snakeWidth = 20;
const snakeHeight = 20;

const foodInitialPositonX = 400;
const foodInitialPositonY = 300;
let foodX = foodInitialPositonX;
let foodY = foodInitialPositonY;
const foodWidth = 20;
const foodHeight = 20;

let score = 0;

let direction;
const movementSpeed = 20;

let target;
let gameOver = false;

function setup() {
  const WIDTH = 1280;
  const HEIGHT = 720;

  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(WIDTH, HEIGHT, "hello");
  r.SetTargetFPS(10);

  return { WIDTH, HEIGHT };
}
function running() {
  return !r.WindowShouldClose();
}

function changeFoodPosition(world) {
  foodX = 20 * r.GetRandomValue(0, world.WIDTH / 20 - foodWidth);
  foodY = 20 * r.GetRandomValue(1, world.HEIGHT / 20 - foodHeight);
  score += 1;
}

function restartGame() {
  score = 0;
  gameOver = false;
}

function moveTail() {
  for (let index = x.length - 1; index > 0; index--) {
    x[index] = x[index - 1];
    y[index] = y[index - 1];
  }
}

function increaseTail() {
  x.push(x.at(-1));
  y.push(y.at(-1));
}

function changeDirection(world) {
  switch (direction) {
    case "right":
      if (x[0] + snakeWidth === foodX && y[0] === foodY) {
        changeFoodPosition(world);
        increaseTail();
      }
      moveTail();
      x[0] += movementSpeed;
      break;

    case "left":
      if (x[0] === foodX + foodWidth && y[0] === foodY) {
        changeFoodPosition(world);
        increaseTail();
      }
      moveTail();
      x[0] -= movementSpeed;
      break;

    case "up":
      if (y[0] === foodY + foodHeight && x[0] === foodX) {
        changeFoodPosition(world);
        increaseTail();
      }
      moveTail();
      y[0] -= movementSpeed;
      break;

    case "down":
      if (y[0] + snakeHeight === foodY && x[0] === foodX) {
        changeFoodPosition(world);
        increaseTail();
      }
      moveTail();
      y[0] += movementSpeed;
      break;
  }
}

function directionToMove() {
  if (r.IsKeyDown(r.KEY_RIGHT) && direction !== "left") {
    direction = "right";
  }
  if (r.IsKeyDown(r.KEY_LEFT) && direction !== "right") {
    direction = "left";
  }
  if (r.IsKeyDown(r.KEY_UP) && direction !== "down") {
    direction = "up";
  }
  if (r.IsKeyDown(r.KEY_DOWN) && direction !== "up") {
    direction = "down";
  }
}

function reset() {
  x = [snakeInitialPositonX];
  y = [snakeInitialPositonY];
  foodX = foodInitialPositonX;
  foodY = foodInitialPositonY;
  direction = "";
}
function update(world) {
  if (
    x[0] + snakeWidth > world.WIDTH ||
    y[0] + snakeHeight > world.HEIGHT ||
    x[0] <= -1 ||
    y[0] <= 20
  )
    gameOver = true;

  if (gameOver) reset();
  if (gameOver && r.IsKeyDown(r.KEY_SPACE)) restartGame();

  directionToMove();
  changeDirection(world);
}

function drawSnake() {
  for (let index = 0; index < x.length; index++) {
    const rectangle = {
      x: x[index],
      y: y[index],
      width: snakeWidth,
      height: snakeHeight,
    };
    r.DrawRectangleRounded(rectangle, 0.6, 8, r.RED);
  }
}

function drawFood() {
  r.DrawRectangle(foodX, foodY, foodWidth, foodHeight, r.BLUE);
}

function drawGameLobby(world) {
  r.DrawText(`score : ${score}`, 2, 2, 20, r.GREEN);
  r.DrawRectangleLines(0, 20, world.WIDTH, world.HEIGHT - 20, r.RED);
  drawFood();
  drawSnake();
}

function drawGameOverLobby(world) {
  r.DrawText("GAME OVER", world.WIDTH / 3, world.HEIGHT / 3, 50, r.RED);
  r.DrawText(
    `score : ${score}`,
    world.WIDTH / 3,
    world.HEIGHT / 2.5,
    50,
    r.GREEN,
  );
  r.DrawText(
    "press space to restart the game ",
    world.WIDTH / 4,
    world.HEIGHT / 2,
    30,
    r.WHITE,
  );
}
function drawWindow(world) {
  r.BeginDrawing();
  r.ClearBackground(r.BLACK);

  if (gameOver) drawGameOverLobby(world);
  else drawGameLobby(world);

  r.EndDrawing();
}

function draw(world) {
  drawWindow(world);
}

function teardown() {
  // r.UnloadTexture();
  r.CloseWindow();
}
module.exports = {
  running,
  setup,
  draw,
  update,
  teardown,
};

// no need of incresing score because it is eqaual to array.length - 1
