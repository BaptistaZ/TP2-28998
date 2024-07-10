class Item extends Sprite {
  constructor({ position, imageSrc, frameRate, frameBuffer, loop }) {
    super({ imageSrc, frameRate, frameBuffer, loop });
    this.position = position;
    this.width = 32;
    this.height = 32;
  }

  update() {
    this.draw();
  }
}
