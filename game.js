const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const canvasSize = 300;
const box = 10;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
let highScorePlayer = localStorage.getItem('highScorePlayer') || 'Player';
let snake;
let food;
let currentDirection = 'RIGHT';
let nextDirection = 'RIGHT';
let gameInterval;

// Update score and high score display
function updateScoreDisplay() {
  document.getElementById('score').textContent = 'Score: ' + score;
  document.getElementById('highscore').textContent = 'Highscore: ' + highScore + ' (' + highScorePlayer + ')';
}

// Start the game
function startGame() {
  // Initial settings
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  score = 0;
  nextDirection = 'RIGHT';

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

  if (nextDirection === 'RIGHT') head.x += box;
  if (nextDirection === 'LEFT') head.x -= box;
  if (nextDirection === 'UP') head.y -= box;
  if (nextDirection === 'DOWN') head.y += box;

  // Snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    generateFood();

    // Update high score
    if (score > highScore) {
      highScore = score;
      highScorePlayer = document.getElementById('playerName').value || 'Player'; // Get the player's name or default to 'Player'
      localStorage.setItem('highScore', highScore); // Save high score
      localStorage.setItem('highScorePlayer', highScorePlayer); // Save the player's name
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
  currentDirection = nextDirection; // Update the direction after move
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

// Button control functions
function moveUp() {
  if (currentDirection !== 'DOWN') nextDirection = 'UP';
}

function moveDown() {
  if (currentDirection !== 'UP') nextDirection = 'DOWN';
}

function moveLeft() {
  if (currentDirection !== 'RIGHT') nextDirection = 'LEFT';
}

function moveRight() {
  if (currentDirection !== 'LEFT') nextDirection = 'RIGHT';
}

// Keyboard event listener for controlling the snake
document.addEventListener('keydown', function(event) {
  if (event.keyCode === 37 && currentDirection !== 'RIGHT') nextDirection = 'LEFT';  // Left arrow
  if (event.keyCode === 38 && currentDirection !== 'DOWN') nextDirection = 'UP';    // Up arrow
  if (event.keyCode === 39 && currentDirection !== 'LEFT') nextDirection = 'RIGHT'; // Right arrow
  if (event.keyCode === 40 && currentDirection !== 'UP') nextDirection = 'DOWN';    // Down arrow
});

// Start the game when the page loads
function initGame() {
  document.querySelector('.game-over').style.display = 'none';
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  startGame();
}

// Start game on button click
document.getElementById('start-btn').addEventListener('click', function() {
  const playerName = document.getElementById('playerName').value || 'Player';
  localStorage.setItem('playerName', playerName);
  initGame();
});

// Button event listeners for controlling the snake
document.getElementById('upButton').addEventListener('click', moveUp);
document.getElementById('downButton').addEventListener('click', moveDown);
document.getElementById('leftButton').addEventListener('click', moveLeft);
document.getElementById('rightButton').addEventListener('click', moveRight);







// =========================================




(function($){
    var canvas = $('#bg').children('canvas'),
      background = canvas[0],
      foreground1 = canvas[1],
      foreground2 = canvas[2],
      config = {
        circle: {
          amount: 18,
          layer: 3,
          color: [157, 97, 207],
          alpha: 0.3
        },
        line: {
          amount: 12,
          layer: 3,
          color: [255, 255, 255],
          alpha: 0.3
        },
        speed: 0.5,
        angle: 20
      };
  
    if (background.getContext){
      var bctx = background.getContext('2d'),
        fctx1 = foreground1.getContext('2d'),
        fctx2 = foreground2.getContext('2d'),
        M = window.Math, // Cached Math
        degree = config.angle/360*M.PI*2,
        circles = [],
        lines = [],
        wWidth, wHeight, timer;
      
      requestAnimationFrame = window.requestAnimationFrame || 
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback, element) { setTimeout(callback, 1000 / 60); };
  
      cancelAnimationFrame = window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        clearTimeout;
  
      var setCanvasHeight = function(){
        wWidth = $(window).width();
        wHeight = $(window).height(),
  
        canvas.each(function(){
          this.width = wWidth;
          this.height = wHeight;
        });
      };
  
      var drawCircle = function(x, y, radius, color, alpha){
        var gradient = fctx1.createRadialGradient(x, y, radius, x, y, 0);
        gradient.addColorStop(0, 'rgba('+color[0]+','+color[1]+','+color[2]+','+alpha+')');
        gradient.addColorStop(1, 'rgba('+color[0]+','+color[1]+','+color[2]+','+(alpha-0.1)+')');
  
        fctx1.beginPath();
        fctx1.arc(x, y, radius, 0, M.PI*2, true);
        fctx1.fillStyle = gradient;
        fctx1.fill();
      };
  
      var drawLine = function(x, y, width, color, alpha){
        var endX = x+M.sin(degree)*width,
          endY = y-M.cos(degree)*width,
          gradient = fctx2.createLinearGradient(x, y, endX, endY);
        gradient.addColorStop(0, 'rgba('+color[0]+','+color[1]+','+color[2]+','+alpha+')');
        gradient.addColorStop(1, 'rgba('+color[0]+','+color[1]+','+color[2]+','+(alpha-0.1)+')');
  
        fctx2.beginPath();
        fctx2.moveTo(x, y);
        fctx2.lineTo(endX, endY);
        fctx2.lineWidth = 3;
        fctx2.lineCap = 'round';
        fctx2.strokeStyle = gradient;
        fctx2.stroke();
      };
  
      var drawBack = function(){
        bctx.clearRect(0, 0, wWidth, wHeight);
  
        var gradient = [];
        
        gradient[0] = bctx.createRadialGradient(wWidth*0.3, wHeight*0.1, 0, wWidth*0.3, wHeight*0.1, wWidth*0.9);
        gradient[0].addColorStop(0, 'rgb(0, 26, 77)');
        gradient[0].addColorStop(1, 'transparent');
  
        bctx.translate(wWidth, 0);
        bctx.scale(-1,1);
        bctx.beginPath();
        bctx.fillStyle = gradient[0];
        bctx.fillRect(0, 0, wWidth, wHeight);
  
        gradient[1] = bctx.createRadialGradient(wWidth*0.1, wHeight*0.1, 0, wWidth*0.3, wHeight*0.1, wWidth);
        gradient[1].addColorStop(0, 'rgb(0, 150, 240)');
        gradient[1].addColorStop(0.8, 'transparent');
  
        bctx.translate(wWidth, 0);
        bctx.scale(-1,1);
        bctx.beginPath();
        bctx.fillStyle = gradient[1];
        bctx.fillRect(0, 0, wWidth, wHeight);
  
        gradient[2] = bctx.createRadialGradient(wWidth*0.1, wHeight*0.5, 0, wWidth*0.1, wHeight*0.5, wWidth*0.5);
        gradient[2].addColorStop(0, 'rgb(40, 20, 105)');
        gradient[2].addColorStop(1, 'transparent');
  
        bctx.beginPath();
        bctx.fillStyle = gradient[2];
        bctx.fillRect(0, 0, wWidth, wHeight);
      };
  
      var animate = function(){
        var sin = M.sin(degree),
          cos = M.cos(degree);
  
        if (config.circle.amount > 0 && config.circle.layer > 0){
          fctx1.clearRect(0, 0, wWidth, wHeight);
          for (var i=0, len = circles.length; i<len; i++){
            var item = circles[i],
              x = item.x,
              y = item.y,
              radius = item.radius,
              speed = item.speed;
  
            if (x > wWidth + radius){
              x = -radius;
            } else if (x < -radius){
              x = wWidth + radius
            } else {
              x += sin*speed;
            }
  
            if (y > wHeight + radius){
              y = -radius;
            } else if (y < -radius){
              y = wHeight + radius;
            } else {
              y -= cos*speed;
            }
  
            item.x = x;
            item.y = y;
            drawCircle(x, y, radius, item.color, item.alpha);
          }
        }
  
        if (config.line.amount > 0 && config.line.layer > 0){
          fctx2.clearRect(0, 0, wWidth, wHeight);
          for (var j=0, len = lines.length; j<len; j++){
            var item = lines[j],
              x = item.x,
              y = item.y,
              width = item.width,
              speed = item.speed;
  
            if (x > wWidth + width * sin){
              x = -width * sin;
            } else if (x < -width * sin){
              x = wWidth + width * sin;
            } else {
              x += sin*speed;
            }
  
            if (y > wHeight + width * cos){
              y = -width * cos;
            } else if (y < -width * cos){
              y = wHeight + width * cos;
            } else {
              y -= cos*speed;
            }
            
            item.x = x;
            item.y = y;
            drawLine(x, y, width, item.color, item.alpha);
          }
        }
  
        timer = requestAnimationFrame(animate);
      };
  
      var createItem = function(){
        circles = [];
        lines = [];
  
        if (config.circle.amount > 0 && config.circle.layer > 0){
          for (var i=0; i<config.circle.amount/config.circle.layer; i++){
            for (var j=0; j<config.circle.layer; j++){
              circles.push({
                x: M.random() * wWidth,
                y: M.random() * wHeight,
                radius: M.random()*(20+j*5)+(20+j*5),
                color: config.circle.color,
                alpha: M.random()*0.2+(config.circle.alpha-j*0.1),
                speed: config.speed*(1+j*0.5)
              });
            }
          }
        }
  
        if (config.line.amount > 0 && config.line.layer > 0){
          for (var m=0; m<config.line.amount/config.line.layer; m++){
            for (var n=0; n<config.line.layer; n++){
              lines.push({
                x: M.random() * wWidth,
                y: M.random() * wHeight,
                width: M.random()*(20+n*5)+(20+n*5),
                color: config.line.color,
                alpha: M.random()*0.2+(config.line.alpha-n*0.1),
                speed: config.speed*(1+n*0.5)
              });
            }
          }
        }
  
        cancelAnimationFrame(timer);
        timer = requestAnimationFrame(animate);
        drawBack();
      };
  
      $(document).ready(function(){
        setCanvasHeight();
        createItem();
      });
      $(window).resize(function(){
        setCanvasHeight();
        createItem();
      });
    }
  })(jQuery);