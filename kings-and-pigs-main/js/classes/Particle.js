class Particle {
  constructor({ position, velocity, radius, color, lifespan }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.lifespan = lifespan;
    this.opacity = 1;
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.lifespan -= 1;
    this.opacity = this.lifespan / 100;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }
}

class ParticleEffect {
  constructor({ position, color, particleCount }) {
    this.particles = [];
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle({
        position: { x: position.x, y: position.y },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2
        },
        radius: Math.random() * 3,
        color: color,
        lifespan: 100
      }));
    }
  }

  update() {
    this.particles.forEach((particle, index) => {
      particle.update();
      if (particle.lifespan <= 0) {
        this.particles.splice(index, 1);
      }
    });
  }

  draw() {
    this.particles.forEach(particle => {
      particle.draw();
    });
  }
}
