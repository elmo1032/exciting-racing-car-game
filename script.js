// Racing Car Game Script

// Canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// HUD elements
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const speedElement = document.getElementById('speed');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScoreElement = document.getElementById('finalScore');

// Game variables
let gameRunning = false;
let score = 0;
let lives = 3;
let speed = 5;
let playerX = canvas.width / 2 - 25;
const playerWidth = 50;
const playerHeight = 100;
const laneWidth = canvas.width / 3;
let keys = {};
let obstacles = [];
let obstacleSpeed = 5;
let frameCount = 0;

// Load images
const playerCar = new Image();
playerCar.src = 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=600';
playerCar.onerror = () => console.error('Failed to load player car image');

const obstacleCar = new Image();
obstacleCar.src = 'https://images.pexels.com/photos/100541/pexels-photo-100541.jpeg?auto=compress&cs=tinysrgb&w=600';
obstacleCar.onerror = () => console.error('Failed to load obstacle car image');

const roadImage = new Image();
roadImage.src = 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600';
roadImage.onerror = () => console.error('Failed to load road image');

let roadY = 0;

// Event listeners for controls
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Start and restart game handlers
startButton.addEventListener('click', () => {
    startGame();
});

restartButton.addEventListener('click', () => {
    restartGame();
});

// Game functions
function startGame() {
    score = 0;
    lives = 3;
    speed = 5;
    obstacleSpeed = 5;
    playerX = canvas.width / 2 - playerWidth / 2;
    obstacles = [];
    gameRunning = true;
    overlay.style.display = 'none';
    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    startGame();
}

function gameOver() {
    gameRunning = false;
    overlay.style.display = 'flex';
    gameOverMessage.style.display = 'block';
    restartButton.style.display = 'inline-block';
    finalScoreElement.textContent = score;
}

// Draw functions
function drawRoad() {
    // Draw scrolling road background
    roadY += speed;
    if (roadY >= canvas.height) {
        roadY = 0;
    }
    ctx.drawImage(roadImage, 0, roadY - canvas.height, canvas.width, canvas.height);
    ctx.drawImage(roadImage, 0, roadY, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerCar, playerX, canvas.height - playerHeight - 10, playerWidth, playerHeight);
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleCar, obstacle.x, obstacle.y, playerWidth, playerHeight);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacleSpeed;
    });
    // Remove obstacles that have moved off screen
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function spawnObstacle() {
    const lane = Math.floor(Math.random() * 3);
    const x = lane * laneWidth + laneWidth / 2 - playerWidth / 2;
    obstacles.push({ x: x, y: -playerHeight });
}

function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            playerX < obstacle.x + playerWidth &&
            playerX + playerWidth > obstacle.x &&
            canvas.height - playerHeight - 10 < obstacle.y + playerHeight &&
            canvas.height - 10 > obstacle.y
        ) {
            return true;
        }
    }
    return false;
}

function updateScore() {
    score++;
    if (score % 500 === 0) {
        speed += 1;
        obstacleSpeed += 1;
    }
    scoreElement.textContent = score;
    speedElement.textContent = speed * 10;
    livesElement.textContent = lives;
}

function updatePlayerPosition() {
    if (keys['ArrowLeft'] || keys['a']) {
        playerX -= 7;
        if (playerX < 0) playerX = 0;
    }
    if (keys['ArrowRight'] || keys['d']) {
        playerX += 7;
        if (playerX > canvas.width - playerWidth) playerX = canvas.width - playerWidth;
    }
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawRoad();
    drawPlayer();
    drawObstacles();

    updatePlayerPosition();
    updateObstacles();

    if (frameCount % 90 === 0) {
        spawnObstacle();
    }

    if (checkCollision()) {
        lives--;
        obstacles = [];
        if (lives <= 0) {
            gameOver();
            return;
        }
    }

    updateScore();

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Initial overlay display
overlay.style.display = 'flex';
gameOverMessage.style.display = 'none';
restartButton.style.display = 'none';
