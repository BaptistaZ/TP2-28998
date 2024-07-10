class Enemy extends Sprite {
  constructor({ position, velocity, imageSrc, frameRate, animations, loop }) {
    super({ position, imageSrc, frameRate, animations, loop });
    this.velocity = velocity;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.checkBounds();
    this.updateFrames();
  }

  checkBounds() {
    if (this.position.x + this.width > canvas.width || this.position.x < 0) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.position.y + this.height > canvas.height || this.position.y < 0) {
      this.velocity.y = -this.velocity.y;
    }
  }

  switchSprite(name) {
    if (this.currentAnimation && this.currentAnimation.name === name) return;
    this.currentAnimation = this.animations[name];
    this.currentFrame = 0;
  }
}
