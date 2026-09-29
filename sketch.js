const r = require("raylib");

const WIDTH = 1280;
const HEIGHT = 720;

const VIRTUALWIDTH = 80;
const VIRTUALHEIGHT = 45;

let snakeInitialPositonX = 30;
let snakeInitialPositonY = 22;
let x = snakeInitialPositonX;
let y = snakeInitialPositonY;
const snakeWidth = 1;
const snakeHeight = 1;

let foodInitialPositonX = 35;
let foodInitialPositonY = 22;
let foodX = foodInitialPositonX;
let foodY = foodInitialPositonY;
const foodWidth = 1;
const foodHeight = 1;

let score = 0;

let direction;
const movementSpeed = 1;


let target;
let gameOver = false;
let restart = false;

function setup() {

    r.InitWindow(WIDTH, HEIGHT, "hello");
    target = r.LoadRenderTexture(VIRTUALWIDTH, VIRTUALHEIGHT);
    r.SetTextureFilter(target.texture, r.TEXTURE_FILTER_POINT);
    r.SetTargetFPS(10);

}
function running() {
    return !r.WindowShouldClose();
}


function update() {

    if (restart) {
        restart = false;
        gameOver = false;
        direction = "";
    }
    directionToMove();

    if (direction === "right") {

        if (x + snakeWidth === foodX && y === foodY) {

            foodX = r.GetRandomValue(0, VIRTUALWIDTH - foodWidth);

            foodY = r.GetRandomValue(0, VIRTUALHEIGHT - foodHeight);
            score += 1;

        }
        x = x + movementSpeed;

    }
    else if (direction === "left") {

        if (x === foodX + foodWidth && y === foodY) {

            foodX = r.GetRandomValue(0, VIRTUALWIDTH - foodWidth);

            foodY = r.GetRandomValue(0, VIRTUALHEIGHT - foodHeight);
            score += 1;

        }
        x = x - movementSpeed;

    }
    else if (direction === "up") {

        if (y === foodY + foodHeight && x === foodX) {

            foodX = r.GetRandomValue(0, VIRTUALWIDTH - foodWidth);

            foodY = r.GetRandomValue(0, VIRTUALHEIGHT - foodHeight);
            score += 1;

        }
        y = y - movementSpeed;

    }
    else if (direction === "down") {

        if (y + snakeHeight === foodY && x === foodX) {

            foodX = r.GetRandomValue(0, VIRTUALWIDTH - foodWidth);

            foodY = r.GetRandomValue(0, VIRTUALHEIGHT - foodHeight);
            score += 1;

        }
        y = y + movementSpeed;

    }

    if (x === VIRTUALWIDTH + 1 || y === VIRTUALHEIGHT + 1 || x + snakeWidth === -1 || y + snakeHeight === -1) gameOver = true;
    if (gameOver && r.IsKeyDown(r.KEY_SPACE)) {
        x = snakeInitialPositonX;
        y = snakeInitialPositonY;
        foodX = foodInitialPositonX;
        foodY = foodInitialPositonY;
        score = 0;
        restart = true;

    }

}


function draw() {
    r.BeginTextureMode(target);
    r.ClearBackground(r.BLACK);

    if (gameOver && !restart) {

        r.DrawText("GAME OVER", VIRTUALWIDTH / 8, VIRTUALHEIGHT / 3, 1, r.RED);
        r.DrawText(`score : ${score}`, VIRTUALWIDTH / 8, VIRTUALHEIGHT / 1.9, 1, r.GREEN);

    }
    else {
        r.DrawText(`score : ${score}`, 2, 2, 1, r.GREEN);
        r.DrawRectangle(foodX, foodY, foodWidth, foodHeight, r.BLUE);
        r.DrawRectangle(x, y, snakeWidth, snakeHeight, r.RED);
    }

    r.EndTextureMode();

    r.BeginDrawing();

    r.ClearBackground(r.WHITE);

    const source = { x: 0, y: 0, width: VIRTUALWIDTH, height: -VIRTUALHEIGHT };
    // Define destination rectangle (Stretches the 320x180 canvas to 1280x720)
    const dest = { x: 0, y: 0, width: WIDTH, height: HEIGHT };
    const origin = { x: 0, y: 0 };

    r.DrawTexturePro(target.texture, source, dest, origin, 0.0, r.WHITE);


    // r.DrawRectangle(foodX, foodY, foodWidth, foodHeight, r.BLUE);
    // r.DrawRectangle(x, y, rectangleWidth, rectangleHeight, r.RED);


    r.EndDrawing();

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


    return direction === 0 ? x : y;
}

function teardown() {
    r.UnloadTexture();
    r.CloseWindow();
}
module.exports = {
    running,
    setup,
    draw,
    update,

}



