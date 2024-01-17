// DOM elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Game configuration
const gridSize = 20;
let gameStarted = false;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;

// Initialize the game
function initializeGame() {
    setEventListeners();
    updateScore();
}

// Set up event listeners
function setEventListeners() {
    document.addEventListener('keydown', handleKeyPress);
}

// Draw the game board
function draw() {
    clearBoard();
    drawSnake();
    drawFood();
    updateScore();
}

// Clear the game board
function clearBoard() {
    board.innerHTML = '';
}

// Draw the snake on the game board
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a game element (div) with specified tag and class
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// Set the position of a game element
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw the food on the game board
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

// Generate random coordinates for the food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y };
}

// Move the snake on the game board
function moveSnake() {
    const head = { ...snake[0] };
    updateHeadPosition(head);
    checkFoodCollision(head);
}

// Update the position of the snake's head based on the current direction
function updateHeadPosition(head) {
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }
}

// Check if the snake has collided with the food
function checkFoodCollision(head) {
    if (head.x === food.x && head.y === food.y) {
        handleFoodCollision();
    } else {
        handleNoCollision(head);
    }
}
function handleFoodCollision() {
    increaseSpeed();
    food = generateFood();
    
    // Add the new head to the snake
    const head = { ...snake[0] };
    updateHeadPosition(head);
    snake.unshift(head);

    // Check if the food is near the snake's body
    const isNearBody = isFoodNearBody();

    // Award bonus score if the food is near the body
    const bonusScore = isNearBody ? 5 : 0;

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay);

    // Update the score with bonus
    updateScore(bonusScore);
}

// Check if the food is near the snake's body
function isFoodNearBody() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        const distance = Math.abs(head.x - segment.x) + Math.abs(head.y - segment.y);

        // You can adjust the threshold for considering the food as near the body
        if (distance <= 2) {
            return true;
        }
    }

    return false;
}




// Handle the case when there is no collision (move the snake)
function handleNoCollision(head) {
    // Add the new head to the snake
    snake.unshift(head);
    // Remove the tail (pop) only if no food was eaten
    if (!(head.x === food.x && head.y === food.y)) {
        snake.pop();
    }
}
// Start the game
function startGame() {
    gameStarted = true;
    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Handle keypress events
function handleKeyPress(event) {
    if ((!gameStarted && (event.code === 'Space' || event.code === ' '))) {
        startGame();
    } else {
        updateDirection(event.key);
    }
}

// Update the snake's direction based on keypress
function updateDirection(key) {
    switch (key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
    }
}

// Increase the speed of the snake
function increaseSpeed() {
    if (gameSpeedDelay > 25) {
        gameSpeedDelay -= (gameSpeedDelay > 150) ? 5 : (gameSpeedDelay > 100) ? 3 : (gameSpeedDelay > 50) ? 2 : 1;
    }
}

// Check for collisions with borders and self
function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame();
    } else {
        checkSelfCollision(head);
    }
}

// Check for collision with the snake's own body
function checkSelfCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Reset the game state
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// Update and display the current score
function updateScore(bonusScore = 0) {
    const currentScore = snake.length - 1 + bonusScore;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Stop the game and display relevant elements
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
    highScoreText.style.display = 'block';
}

// Update the high score if the current score is higher
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
}

// Initialize the game
initializeGame();
