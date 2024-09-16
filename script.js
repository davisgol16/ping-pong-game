// Seleciona o canvas e o contexto de desenho
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Tamanho da raquete
const paddleWidth = 10;
const paddleHeight = 100;

// Contadores de Pontos
let playerScore = 0;
let secondPlayerScore = 0;

// Modos de Jogo
let gameMode = 'none'; // 'one' para 1 jogador, 'two' para 2 jogadores

// Cria as raquetes
const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'red',  // Raquete vermelha
    dy: 5 // Velocidade de movimento
};

const secondPlayerPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'blue',  // Raquete azul
    dy: 5
};

// Cria a bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 4,  // Direção horizontal
    dy: 4,  // Direção vertical
    color: 'white'
};

// Função para desenhar a raquete
function drawPaddle(paddle) {
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Função para desenhar a bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// Função para mover a bola
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisão com as paredes superior e inferior
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;  // Inverte a direção vertical
    }

    // Colisão com as raquetes
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx *= -1;  // Inverte a direção horizontal
    }

    if (ball.x + ball.radius > secondPlayerPaddle.x &&
        ball.y > secondPlayerPaddle.y && ball.y < secondPlayerPaddle.y + secondPlayerPaddle.height) {
        ball.dx *= -1;
    }

    // Verifica se a bola passou pelas raquetes
    if (ball.x + ball.radius < 0) {
        secondPlayerScore++;
        updateScore();
        announcePoint('Jogador 2');
        resetBall();
    }

    if (ball.x - ball.radius > canvas.width) {
        playerScore++;
        updateScore();
        announcePoint('Jogador 1');
        resetBall();
    }
}

// Função para mover a raquete do jogador
function movePlayerPaddle(event) {
    const key = event.key;
    if (key === 'ArrowUp' && playerPaddle.y > 0) {
        playerPaddle.y -= playerPaddle.dy;
    } else if (key === 'ArrowDown' && playerPaddle.y + playerPaddle.height < canvas.height) {
        playerPaddle.y += playerPaddle.dy;
    }
}

// Função para mover a raquete do segundo jogador
function moveSecondPlayerPaddle(event) {
    const key = event.key;
    if (key === 'w' && secondPlayerPaddle.y > 0) {
        secondPlayerPaddle.y -= secondPlayerPaddle.dy;
    } else if (key === 's' && secondPlayerPaddle.y + secondPlayerPaddle.height < canvas.height) {
        secondPlayerPaddle.y += secondPlayerPaddle.dy;
    }
}

// Função para reiniciar a bola
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;  // Muda a direção da bola após cada ponto
}

// Atualiza o placar no HTML
function updateScore() {
    document.getElementById('playerScore').innerText = playerScore;
    document.getElementById('secondPlayerScore').innerText = secondPlayerScore;
}

// Anuncia o ponto marcado para acessibilidade
function announcePoint(winner) {
    const announcement = new SpeechSynthesisUtterance(`${winner} marcou um ponto!`);
    window.speechSynthesis.speak(announcement);
}

// Função principal de atualização do jogo
function update() {
    moveBall();
    // No modo de dois jogadores, movimenta as duas raquetes
}

// Função para desenhar tudo
function draw() {
    // Limpa a tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as raquetes e a bola
    drawPaddle(playerPaddle);
    drawPaddle(secondPlayerPaddle);
    drawBall();
}

// Função de loop do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Função para iniciar o jogo
function startGame(mode) {
    gameMode = mode;
    document.getElementById('menu').style.display = 'none'; // Esconde o menu
    canvas.style.display = 'block'; // Exibe o canvas
    gameLoop(); // Inicia o loop do jogo
}

// Event listeners para os botões de modo de jogo
document.getElementById('onePlayerBtn').addEventListener('click', () => startGame('one'));
document.getElementById('twoPlayersBtn').addEventListener('click', () => startGame('two'));

// Event listeners para mover as raquetes
document.addEventListener('keydown', (event) => {
    if (gameMode === 'one') {
        movePlayerPaddle(event);
    } else if (gameMode === 'two') {
        movePlayerPaddle(event);
        moveSecondPlayerPaddle(event);
    }
});
