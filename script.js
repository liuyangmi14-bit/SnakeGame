// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const speedSlider = document.getElementById('speedSlider');
const speedValue = document.getElementById('speedValue');

// 游戏配置
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;

// 游戏状态
let gameRunning = false;
let gamePaused = false;
let score = 0;

// 蛇的初始位置和速度
let snake = [
    { x: 5, y: 5 }
];
let velocityX = 0;
let velocityY = 0;
let nextVelocityX = 0;
let nextVelocityY = 0;

// 食物位置
let food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
};

// 游戏主循环
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    // 更新游戏状态
    moveSnake();
    checkCollision();
    
    // 绘制游戏
    drawGame();
    
    // 控制游戏速度
    setTimeout(gameLoop, 1000 / speed);
}

// 移动蛇
function moveSnake() {
    // 更新方向
    velocityX = nextVelocityX;
    velocityY = nextVelocityY;
    
    // 移动蛇头
    const head = { 
        x: snake[0].x + velocityX, 
        y: snake[0].y + velocityY 
    };
    
    // 添加新的蛇头
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        scoreElement.textContent = score;
        
        // 生成新的食物
        generateFood();
        
        // 每得50分增加速度
        if (score % 50 === 0) {
            speed += 1;
        }
    } else {
        // 如果没有吃到食物，移除蛇尾
        snake.pop();
    }
}

// 检查碰撞
function checkCollision() {
    const head = snake[0];
    
    // 检查是否撞墙
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

// 绘制游戏
function drawGame() {
    // 清空画布
    ctx.fillStyle = '#e8f5e9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        // 蛇头用深绿色，蛇身用绿色
        ctx.fillStyle = index === 0 ? '#388E3C' : '#4CAF50';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        
        // 绘制蛇身边框
        ctx.strokeStyle = '#e8f5e9';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

// 生成食物
function generateFood() {
    // 随机生成食物位置
    let newFood;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // 确保食物不会出现在蛇身上
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = newFood;
}

// 游戏结束
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverScreen.classList.add('active');
}

// 重置游戏
function resetGame() {
    // 重置蛇
    snake = [{ x: 5, y: 5 }];
    velocityX = 0;
    velocityY = 0;
    nextVelocityX = 0;
    nextVelocityY = 0;
    
    // 重置食物
    generateFood();
    
    // 重置分数和速度
    score = 0;
    scoreElement.textContent = score;
    // 使用用户设置的速度
    speed = parseInt(speedSlider.value);
    
    // 重置游戏状态
    gameRunning = true;
    gamePaused = false;
    pauseButton.textContent = '暂停';
    
    // 隐藏开始和结束屏幕
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    
    // 开始游戏循环
    gameLoop();<!-- test deploy -->

}

// 暂停/继续游戏
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseButton.textContent = gamePaused ? '继续' : '暂停';
    
    if (!gamePaused) {
        gameLoop();
    }
}

// 键盘控制
function handleKeyDown(e) {
    // 如果游戏未开始或已暂停，忽略按键
    if (!gameRunning || gamePaused) return;
    
    // 防止蛇反向移动
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (velocityY !== 1) {
                nextVelocityX = 0;
                nextVelocityY = -1;
            }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (velocityY !== -1) {
                nextVelocityX = 0;
                nextVelocityY = 1;
            }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (velocityX !== 1) {
                nextVelocityX = -1;
                nextVelocityY = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (velocityX !== -1) {
                nextVelocityX = 1;
                nextVelocityY = 0;
            }
            break;
        case ' ':
            togglePause();
            break;
    }
}

// 速度控制功能
speedSlider.addEventListener('input', function() {
    speed = parseInt(this.value);
    speedValue.textContent = speed;
});

// 事件监听
document.addEventListener('keydown', handleKeyDown);
startButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', resetGame);
pauseButton.addEventListener('click', togglePause);

// 初始绘制游戏
drawGame();