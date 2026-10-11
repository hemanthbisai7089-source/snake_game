const r = require("raylib");

const snakeInitialPositonX = 30;
const snakeInitialPositonY = 22;

let x = [snakeInitialPositonX];
let y = [snakeInitialPositonY];

const snakeWidth = 1;
const snakeHeight = 1;

const foodInitialPositonX = 35;
const foodInitialPositonY = 22;
let foodX = foodInitialPositonX;
let foodY = foodInitialPositonY;
const foodWidth = 1;
const foodHeight = 1;

let score = 0;

let direction;
const movementSpeed = 1;

let target;
let gameOver = false;

function setup() {
  const WIDTH = 1280;
  const HEIGHT = 720;

  const VIRTUALWIDTH = WIDTH / 16;
  const VIRTUALHEIGHT = HEIGHT / 16;

  r.SetTraceLogLevel(r.LOG_NONE);
  r.InitWindow(WIDTH, HEIGHT, "hello");
  target = r.LoadRenderTexture(VIRTUALWIDTH, VIRTUALHEIGHT);
  r.SetTextureFilter(target.texture, r.TEXTURE_FILTER_POINT);
  r.SetTargetFPS(20);

  return { WIDTH, HEIGHT, VIRTUALWIDTH, VIRTUALHEIGHT };
}
function running() {
  return !r.WindowShouldClose();
}

function changeFoodPosition(world) {
  foodX = r.GetRandomValue(0, world.VIRTUALWIDTH - foodWidth);
  foodY = r.GetRandomValue(0, world.VIRTUALHEIGHT - foodHeight);
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
    x[0] + snakeWidth > world.VIRTUALWIDTH ||
    y[0] + snakeHeight > world.VIRTUALHEIGHT ||
    x[0] <= -1 ||
    y[0] <= -1
  )
    gameOver = true;

  if (gameOver) reset();
  if (gameOver && r.IsKeyDown(r.KEY_SPACE)) restartGame();

  directionToMove();
  changeDirection(world);
}

function drawSnake() {
  for (let index = 0; index < x.length; index++) {
    r.DrawRectangle(x[index], y[index], snakeWidth, snakeHeight, r.RED);
  }
}

function drawTexture() {
  r.BeginTextureMode(target);
  r.ClearBackground(r.BLACK);

  r.DrawRectangle(foodX, foodY, foodWidth, foodHeight, r.BLUE);
  drawSnake();

  r.EndTextureMode();
}

function drawGameLobby(world) {
  const source = {
    x: 0,
    y: 0,
    width: world.VIRTUALWIDTH,
    height: -world.VIRTUALHEIGHT,
  };
  // Define destination rectangle (Stretches the 320x180 canvas to 1280x720)
  const dest = { x: 0, y: 20, width: world.WIDTH, height: world.HEIGHT - 20 };
  const origin = { x: 0, y: 0 };

  r.DrawTexturePro(target.texture, source, dest, origin, 0.0, r.WHITE);
  r.DrawText(`score : ${score}`, 2, 2, 20, r.GREEN);
  r.DrawRectangleLines(0, 20, world.WIDTH, world.HEIGHT - 20, r.RED);
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
  drawTexture(world);
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
