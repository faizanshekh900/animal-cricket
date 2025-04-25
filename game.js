const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game state
let gameState = {
    runs: 0,
    wickets: 0,
    overs: 0,
    balls: 0,
    isPlaying: false,
    ball: {
        x: 100,
        y: 200,
        speed: 0,
        angle: 0
    },
    batsman: {
        x: 600,
        y: 200,
        width: 30,
        height: 60
    }
};

// Update score display
function updateScore() {
    document.getElementById('runs').textContent = gameState.runs;
    document.getElementById('wickets').textContent = gameState.wickets;
    document.getElementById('overs').textContent = `${gameState.overs}.${gameState.balls}`;
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pitch
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(350, 100, 100, 200);

    // Draw batsman
    ctx.fillStyle = '#000';
    ctx.fillRect(gameState.batsman.x, gameState.batsman.y, gameState.batsman.width, gameState.batsman.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// Game loop
function gameLoop() {
    if (gameState.isPlaying) {
        // Update ball position
        gameState.ball.x += Math.cos(gameState.ball.angle) * gameState.ball.speed;
        gameState.ball.y += Math.sin(gameState.ball.angle) * gameState.ball.speed;

        // Check for collision with batsman
        if (gameState.ball.x + 5 > gameState.batsman.x && 
            gameState.ball.x - 5 < gameState.batsman.x + gameState.batsman.width &&
            gameState.ball.y + 5 > gameState.batsman.y && 
            gameState.ball.y - 5 < gameState.batsman.y + gameState.batsman.height) {
            // Ball hit
            const runs = Math.floor(Math.random() * 7); // Random runs between 0-6
            gameState.runs += runs;
            gameState.balls++;
            if (gameState.balls === 6) {
                gameState.overs++;
                gameState.balls = 0;
            }
            updateScore();
            resetBall();
        }

        // Check if ball is out of bounds
        if (gameState.ball.x < 0 || gameState.ball.x > canvas.width || 
            gameState.ball.y < 0 || gameState.ball.y > canvas.height) {
            // Ball missed
            gameState.wickets++;
            gameState.balls++;
            if (gameState.balls === 6) {
                gameState.overs++;
                gameState.balls = 0;
            }
            updateScore();
            resetBall();
        }

        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Reset ball position
function resetBall() {
    gameState.ball.x = 100;
    gameState.ball.y = 200;
    gameState.ball.speed = 0;
    gameState.isPlaying = false;
    playButton.textContent = 'Play Ball!';
}

// Event listeners
playButton.addEventListener('click', () => {
    if (!gameState.isPlaying) {
        gameState.isPlaying = true;
        gameState.ball.speed = 5;
        gameState.ball.angle = Math.random() * Math.PI - Math.PI/2; // Random angle
        playButton.textContent = 'Playing...';
        gameLoop();
    }
});

restartButton.addEventListener('click', () => {
    gameState.runs = 0;
    gameState.wickets = 0;
    gameState.overs = 0;
    gameState.balls = 0;
    updateScore();
    resetBall();
    draw();
});

// Initial draw
draw(); 