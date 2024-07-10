class PatrollingEnemy extends Enemy {
  constructor({ position, velocity, frameRate, loop, collisionBlocks }) {
    const animations = {
      runRight: {
        frameRate: 6,
        frameBuffer: 8,
        loop: true,
        imageSrc: './img/02-King Pig/KingPigRun(38x28).png'
      },
      runLeft: {
        frameRate: 6,
        frameBuffer: 8,
        loop: true,
        imageSrc: './img/02-King Pig/KingPigRun(38x28).png'
      }
    };
    super({ position, velocity, imageSrc: './img/02-King Pig/KingPigRun(38x28).png', frameRate, animations, loop });
    this.collisionBlocks = collisionBlocks;
    this.gravity = 1;
    this.speed = Math.abs(velocity.x);
    this.direction = 1; // 1 para direita, -1 para esquerda
  }

  update() {
    this.applyGravity();
    this.position.x += this.speed * this.direction;
    this.position.y += this.velocity.y;
    this.updateFrames();
    this.checkBounds();
    this.checkForHorizontalCollisions();
    this.checkForVerticalCollisions();
    this.jumpIfNeeded();

    if (this.direction > 0) {
      this.switchSprite('runRight');
    } else {
      this.switchSprite('runLeft');
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
  }

  checkBounds() {
    if (this.position.x <= 0) {
      this.position.x = 0;
      this.direction = 1; // Mudar a direção para direita
    }

    if (this.position.x + this.width >= canvas.width) {
      this.position.x = canvas.width - this.width;
      this.direction = -1; // Mudar a direção para esquerda
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.position.x + this.width >= collisionBlock.position.x &&
        this.position.y + this.height >= collisionBlock.position.y &&
        this.position.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.direction < 0) {
          this.position.x = collisionBlock.position.x + collisionBlock.width + 0.01;
          this.direction = 1; // Mudar a direção para direita
        } else if (this.direction > 0) {
          this.position.x = collisionBlock.position.x - this.width - 0.01;
          this.direction = -1; // Mudar a direção para esquerda
        }
      }
    }
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.position.x + this.width >= collisionBlock.position.x &&
        this.position.y + this.height >= collisionBlock.position.y &&
        this.position.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y + collisionBlock.height + 0.01;
        } else if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - this.height - 0.01;
        }
      }
    }
  }

  jumpIfNeeded() {
    const nextX = this.position.x + this.direction * this.width; // Calcula a próxima posição horizontal do inimigo com base na direção e na largura do corpo do inimigo.
    const isPlatformAhead = this.collisionBlocks.some(platform => {
      return nextX > platform.position.x &&
             nextX < platform.position.x + platform.width &&
             this.position.y + this.height < platform.position.y;
    });

    if (isPlatformAhead && this.velocity.y === 0) {
      this.velocity.y = -1,3; // Força de salto
    }
  }
}
