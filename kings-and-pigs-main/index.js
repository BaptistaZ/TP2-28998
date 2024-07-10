const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 64 * 16; // 1024
canvas.height = 64 * 9; // 576

const menu = document.getElementById('menu');
const pauseMenu = document.getElementById('pause-menu');
const gameOverMenu = document.getElementById('game-over-menu'); 
const startGameButton = document.getElementById('start-game');
const settingsButton = document.getElementById('settings');
const exitButton = document.getElementById('exit');
const pauseGameButton = document.getElementById('pause-game');
const resumeGameButton = document.getElementById('resume-game');
const mainMenuButton = document.querySelector('#pause-menu #main-menu');  
const restartGameButton = document.getElementById('restart-game'); 
const mainMenuButtonGameOver = document.querySelector('#game-over-menu #main-menu'); 

let isPaused = false;
let gameStarted = false;
let score = 0;
let playerLife = 100; 
let invincibilityTimeout = null; // Adicione uma variável de tempo de invencibilidade
const invincibilityDuration = 3000; // Duração da invencibilidade em milissegundos (3 segundos)
const scoreElement = document.getElementById('score');
const lifeElement = document.getElementById('life'); 
let particleEffects = []; 

// Função para redefinir a pontuação e a vida
function resetGameStats() {
  score = 0;
  playerLife = 100;
  scoreElement.innerText = `Score: ${score}`;
  lifeElement.innerText = `Life: ${playerLife}`;
  clearTimeout(invincibilityTimeout); // Limpar o timeout de invencibilidade
  invincibilityTimeout = null;
}

// Função para verificar se todos os inimigos foram derrotados
function checkAllEnemiesDefeated() {
  if (enemies.length === 0) {
    player.allEnemiesDefeated = true;
  } else {
    player.allEnemiesDefeated = false;
  }
}

// Mostrar o menu principal
function showMenu() {
  menu.style.display = 'block';
  clearCanvas();
}

// Esconder o menu principal
function hideMenu() {
  menu.style.display = 'none';
}

// Mostrar o menu de pausa
function showPauseMenu() {
  pauseMenu.style.display = 'block';
}

// Esconder o menu de pausa
function hidePauseMenu() {
  pauseMenu.style.display = 'none';
}

// Mostrar o menu de game over
function showGameOverMenu() {
  gameOverMenu.style.display = 'block';
}

// Esconder o menu de game over
function hideGameOverMenu() {
  gameOverMenu.style.display = 'none';
}

// Iniciar o jogo
startGameButton.addEventListener('click', () => {
  hideMenu();
  gameStarted = true;
  resetGameStats(); // Redefinir a pontuação e a vida ao iniciar o jogo
  startGame();
});

// Reiniciar o jogo
restartGameButton.addEventListener('click', () => {
  hideGameOverMenu();
  gameStarted = true;
  resetGameStats(); // Redefinir a pontuação e a vida ao reiniciar o jogo
  startGame();
});

// Configurações
settingsButton.addEventListener('click', () => {
  alert('Configurações não implementadas.');
});

// Sair do jogo
exitButton.addEventListener('click', () => {
  window.close();
});

// Pausar e retomar o jogo
pauseGameButton.addEventListener('click', () => {
  isPaused = !isPaused;
  if (isPaused) {
    showPauseMenu();
  } else {
    hidePauseMenu();
    animate();
  }
});

// Retomar o jogo
resumeGameButton.addEventListener('click', () => {
  isPaused = false;
  hidePauseMenu();
  animate();
});

// Voltar ao menu principal a partir do menu de pausa
mainMenuButton.addEventListener('click', () => {
  isPaused = false;
  gameStarted = false;
  hidePauseMenu();
  resetGameStats(); // Redefinir a pontuação e a vida ao voltar ao menu principal
  showMenu();
});

// Voltar ao menu principal a partir do menu de game over
mainMenuButtonGameOver.addEventListener('click', () => {
  gameStarted = false;
  hideGameOverMenu();
  resetGameStats(); // Redefinir a pontuação e a vida ao voltar ao menu principal
  showMenu();
});

// Função para iniciar o jogo
function startGame() {
  levels[level].init();
  animate();
}

// Função para limpar o canvas
function clearCanvas() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

// Inicializar o menu ao carregar a página
window.onload = showMenu;

let parsedCollisions;
let collisionBlocks;
let background;
let doors;
const player = new Player({
  imageSrc: './img/king/idle.png',
  frameRate: 11,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idle.png',
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idleLeft.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runRight.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runLeft.png',
    },
    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: './img/king/enterDoor.png',
      onComplete: () => {
        console.log('completed animation');
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++;
            if (level === 4) level = 1;
            levels[level].init();
            player.switchSprite('idleRight');
            player.preventInput = false;
            gsap.to(overlay, {
              opacity: 0,
            });
          },
        });
      },
    },
    attackRight: {
      frameRate: 6,
      frameBuffer: 2,
      loop: false,
      imageSrc: './img/king/Attack.png',
    },
    attackLeft: {
      frameRate: 6,
      frameBuffer: 2,
      loop: false,
      imageSrc: './img/king/Attack.png',
    },
  },
});

let enemies = [];
let items = [];

let level = 1;
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      if (player.currentAnimation) player.currentAnimation.isActive = false;
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel1.png',
      });
      doors = [
        new Sprite({
          position: {
            x: 767,
            y: 270,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];

      // Adicionar inimigos
      enemies = []; // Resetar inimigos
      enemies.push(new PatrollingEnemy({
        position: { x: 300, y: 300 },
        velocity: { x: 1, y: 0 },
        frameRate: 5,
        loop: true,
        collisionBlocks: collisionBlocks
      }));

      // Adicionar itens
      items = []; // Resetar itens
      items.push(new Item({
        position: { x: 400, y: 200 },
        imageSrc: './img/Vida/Energy.png',
        frameRate: 1,
        frameBuffer: 1,
        loop: false,
        width: 32, // Define a largura do item
        height: 32 // Define a altura do item
      }));
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 96;
      player.position.y = 140;
      if (player.currentAnimation) player.currentAnimation.isActive = false;
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel2.png',
      });
      doors = [
        new Sprite({
          position: {
            x: 772.0,
            y: 336,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];

      // Adicionar inimigos
      enemies = []; // Resetar inimigos
      enemies.push(new PatrollingEnemy({
        position: { x: 500, y: 400 },
        velocity: { x: 1, y: 0 },
        frameRate: 5,
        loop: true,
        collisionBlocks: collisionBlocks
      }));

      // Adicionar itens
      items = []; // Resetar itens
      items.push(new Item({
        position: { x: 500, y: 400 },
        imageSrc: './img/Vida/Energy.png',
        frameRate: 1,
        frameBuffer: 1,
        loop: false,
        width: 32, // Define a largura do item
        height: 32 // Define a altura do item
      }));
    },
  },
  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 750;
      player.position.y = 230;
      if (player.currentAnimation) player.currentAnimation.isActive = false;
      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel3.png',
      });
      doors = [
        new Sprite({
          position: {
            x: 176.0,
            y: 335,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];

      // Adicionar inimigos
      enemies = []; // Resetar inimigos
    
      enemies.push(new PatrollingEnemy({
        position: { x: 500, y: 400 },
        velocity: { x: 1, y: 0 },
        frameRate: 5,
        loop: true,
        collisionBlocks: collisionBlocks
      }));

      // Adicionar itens
      items = []; // Resetar itens
      items.push(new Item({
        position: { x: 600, y: 300 },
        imageSrc: './img/Vida/Energy.png',
        frameRate: 1,
        frameBuffer: 1,
        loop: false,
        width: 32, // Define a largura do item
        height: 32 // Define a altura do item
      }));
    },
  },
};

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

const overlay = {
  opacity: 0,
};

function animate() {
  if (isPaused || !gameStarted) return;
  window.requestAnimationFrame(animate);
  clearCanvas();

  background.draw();
  doors.forEach((door) => {
    door.draw();
  });
  player.handleInput(keys);
  player.update();
  player.draw();

  // Atualizar e desenhar inimigos
  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();

    // Verificar colisão com a caixa de ataque do jogador
    if (player.isAttacking &&
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x &&
        player.attackBox.position.x <= enemy.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >= enemy.position.y &&
        player.attackBox.position.y <= enemy.position.y + enemy.height) {
      enemies.splice(index, 1); // Remover o inimigo atingido
      score += 10; // Aumentar a pontuação
      scoreElement.innerText = `Score: ${score}`; // Atualizar a exibição da pontuação
      checkAllEnemiesDefeated(); // Verificar se todos os inimigos foram derrotados

      // Adicionar efeito de partículas
      particleEffects.push(new ParticleEffect({
        position: { x: enemy.position.x + enemy.width / 2, y: enemy.position.y + enemy.height / 2 },
        color: 'red',
        particleCount: 20
      }));
    }

    // Verificar colisão entre o jogador e os inimigos
    if (player.hitbox.position.x + player.hitbox.width >= enemy.position.x &&
        player.hitbox.position.x <= enemy.position.x + enemy.width &&
        player.hitbox.position.y + player.hitbox.height >= enemy.position.y &&
        player.hitbox.position.y <= enemy.position.y + enemy.height) {
      if (!invincibilityTimeout) { // Verifique se o jogador não está invencível
        playerLife -= 20; // Diminuir a vida do jogador
        lifeElement.innerText = `Life: ${playerLife}`; // Atualizar a exibição da vida

        // Definir um timeout para a invencibilidade
        invincibilityTimeout = setTimeout(() => {
          invincibilityTimeout = null; // Permitir que o jogador leve dano novamente após o tempo de invencibilidade expirar
        }, invincibilityDuration);

        // Verificar se a vida do jogador chegou a zero
        if (playerLife <= 0) {
          gameStarted = false;
          showGameOverMenu();
          return; // Parar a execução da função animate
        }
      }
    }
  });

  // Atualizar e desenhar itens
  items.forEach((item, index) => {
    item.update();

    // Verificar colisão entre o jogador e os itens
    if (player.hitbox.position.x + player.hitbox.width >= item.position.x &&
        player.hitbox.position.x <= item.position.x + item.width &&
        player.hitbox.position.y + player.hitbox.height >= item.position.y &&
        player.hitbox.position.y <= item.position.y + item.height) {
      items.splice(index, 1); // Remover o item coletado
      playerLife = Math.min(playerLife + 20, 100); // Aumentar a vida do jogador sem ultrapassar 100
      lifeElement.innerText = `Life: ${playerLife}`; // Atualizar a exibição da vida
    }
  });

  // Atualizar e desenhar efeitos de partículas
  particleEffects.forEach((effect, index) => {
    effect.update();
    effect.draw();
    if (effect.particles.length === 0) {
      particleEffects.splice(index, 1); // Remover o efeito de partículas quando todas as partículas desaparecerem
    }
  });

  // Verificar se o jogador está tentando entrar em uma porta
  doors.forEach((door) => {
    if (
      player.hitbox.position.x + player.hitbox.width >= door.position.x &&
      player.hitbox.position.x <= door.position.x + door.width &&
      player.hitbox.position.y + player.hitbox.height >= door.position.y &&
      player.hitbox.position.y <= door.position.y + door.height &&
      player.allEnemiesDefeated // Permitir entrada na porta apenas se todos os inimigos foram derrotados
    ) {
      player.switchSprite('enterDoor');
      player.preventInput = true;
    }
  });

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'd':
      keys.d.pressed = true;
      break;
    case 'a':
      keys.a.pressed = true;
      break;
    case ' ':
      keys.space.pressed = true;
      player.attack(); // Forçar a animação de ataque ao pressionar espaço
      break;
  }
});

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case ' ':
      keys.space.pressed = false;
      break;
  }
});

window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'd':
      keys.d.pressed = true;
      break;
    case 'a':
      keys.a.pressed = true;
      break;
    case ' ':
      keys.space.pressed = true;
      player.attack(); // Chame a função de ataque
      break;
  }
});

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case ' ':
      keys.space.pressed = false;
      break;
  }
});
