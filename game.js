const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
let startX, startY, endX, endY;

function handleTouchStart(e) {
    const touch = e.touches[0]; // Get the first touch
    startX = touch.clientX; // Record starting X position
    startY = touch.clientY; // Record starting Y position
}

function handleTouchEnd(e) {
    const touch = e.changedTouches[0]; // Get the ending touch
    endX = touch.clientX; // Record ending X position
    endY = touch.clientY; // Record ending Y position

    const diffX = endX - startX; // Horizontal swipe distance
    const diffY = endY - startY; // Vertical swipe distance

    // Determine swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        // Vertical swipe
        if (diffY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
}

// Add touch event listeners to the game container
const gameContainer = document.getElementById('game-container');
gameContainer.addEventListener('touchstart', handleTouchStart);
gameContainer.addEventListener('touchend', handleTouchEnd);

// Optional: Prevent default behavior of touch events (scrolling)
gameContainer.addEventListener('touchmove', function(e) {
    e.preventDefault(); 
}, { passive: false });




const canvasSize = 300;
const box = 10;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let snake;
let food;
let direction;
let gameInterval;

// Update score and high score display
function updateScoreDisplay() {
  document.getElementById('current-score').textContent = 'Score: ' + score;
  document.getElementById('high-score').textContent = 'High Score: ' + highScore;
}

function startGame() {
  // Initial settings
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  score = 0;
  direction = 'RIGHT';
  
  snake = [
    { x: 50, y: 50 },
    { x: 40, y: 50 },
    { x: 30, y: 50 },
  ];
  
  generateFood();
  clearInterval(gameInterval);
  gameInterval = setInterval(update, 100);
  document.querySelector('.game-over').style.display = 'none';

  updateScoreDisplay();
}

// Game update function
function update() {
  // Move the snake by creating a new head based on the direction
  let head = { ...snake[0] };

  if (direction === 'RIGHT') head.x += box;
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // Snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    generateFood();

    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore); // Save high score
    }
  } else {
    snake.pop(); // Remove the tail
  }

  // Check for game over
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    document.querySelector('.game-over').style.display = 'block';
    updateScoreDisplay();
    return;
  }

  // Add new head to the snake
  snake.unshift(head);
  draw();
}

// Drawing function for the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.fillStyle = '#32CD32'; // Snake color (bright green)

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  
  // Draw the food
  ctx.fillStyle = '#FF6347'; // Food color (tomato red)
  ctx.fillRect(food.x, food.y, box, box);

  // Draw the score
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, canvasSize - 10);
}

// Generate food at random position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };
}

// Keyboard event listener for controlling the snake
document.addEventListener('keydown', function(event) {
  if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
  if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
  if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
  if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
});

// Start the game when the page loads
startGame();
