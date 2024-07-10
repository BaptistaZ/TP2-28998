class Player extends Sprite {
  constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
    super({ imageSrc, frameRate, animations, loop });
    this.position = {
      x: 200,
      y: 200,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.sides = {
      bottom: this.position.y + this.height,
    };
    this.gravity = 1;

    this.collisionBlocks = collisionBlocks;

    this.isAttacking = false;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 2, // Aumente a largura da caixa de ataque
      height: 100,
    };

    this.animations = {
      ...animations,
      attackRight: {
        frameRate: 6,
        frameBuffer: 4, 
        loop: false,
        imageSrc: 'kings-and-pigs-main\img\king\Attack.png',
      },
      attackLeft: {
        frameRate: 6,
        frameBuffer: 4, 
        loop: false,
        imageSrc: 'kings-and-pigs-main\img\king\Attack.png',
      }
    };

    this.lastDirection = 'right';
  }

  update() {
    this.position.x += this.velocity.x;

    this.updateHitbox();
    this.updateAttackBox();

    this.checkForHorizontalCollisions();
    this.applyGravity();

    this.updateHitbox();
    this.updateAttackBox();

    this.checkForVerticalCollisions();
    this.draw(); // Certifique-se de desenhar o jogador
  }

  handleInput(keys) {
    if (this.preventInput) return;
    this.velocity.x = 0;

    if (keys.d.pressed) {
      this.switchSprite('runRight');
      this.velocity.x = 5;
      this.lastDirection = 'right';
    } else if (keys.a.pressed) {
      this.switchSprite('runLeft');
      this.velocity.x = -5;
      this.lastDirection = 'left';
    } else {
      if (this.lastDirection === 'left') this.switchSprite('idleLeft');
      else this.switchSprite('idleRight');
    }

    if (keys.space.pressed && !this.isAttacking) {
      this.attack();
    }
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;
    this.currentAnimation = this.animations[name];

    if (name.includes('attack')) {
      this.onAnimationComplete = () => {
        this.isAttacking = false;
        this.onAnimationComplete = null;
      };
    }
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 58,
        y: this.position.y + 34,
      },
      width: 50,
      height: 53,
    };
  }

  updateAttackBox() {
    if (this.lastDirection === 'right') {
      this.attackBox.position.x = this.position.x + this.width;
    } else {
      this.attackBox.position.x = this.position.x - this.attackBox.width;
    }
    this.attackBox.position.y = this.position.y;
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }

        if (this.velocity.x > 0) {
          const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (
        this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
        this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }

        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }

  attack() {
    this.isAttacking = true;

    if (this.lastDirection === 'right') {
      this.switchSprite('attackRight');
    } else {
      this.switchSprite('attackLeft');
    }

    setTimeout(() => {
      this.isAttacking = false;
    }, 500); // Duração do ataque
  }

  draw() {
    super.draw();
  }
}
