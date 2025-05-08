class Pacman {
  constructor(x, y, width, height, speed) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.direction = 4;
      this.nextDirection = 4;
      this.frameCount = 7;
      this.currentFrame = 1;
      setInterval(() => {
          this.changeAnimation();
      }, 150);
  }

  moveProcess() {
      this.changeDirectionIfPossible();
      this.moveForwards();
      if (this.checkCollisions()) {
          this.moveBackwards();
          return;
      }
      this.checkTeleport();
  }

  checkTeleport() {
      // Tunnel line (line 10, index 9 in map array)
      const tunnelRow = 10;

      // Check if Pacman is on the tunnel line (within a small tolerance margin)
      const pacmanRow = Math.floor(this.y / oneBlockSize);
      const isTunnelRow = (pacmanRow === tunnelRow ||
                          // Increased tolerance to allow vertical movement after teleportation
                          Math.abs(this.y - (tunnelRow * oneBlockSize)) < oneBlockSize);

      if (!isTunnelRow) {
          return; // Does not allow teleportation outside the tunnel line
      }

      const rightBorder = map[0].length * oneBlockSize;
      const leftBorder = 0;

      // Check if Pacman touched the left edge
      if (this.x <= leftBorder && this.direction === DIRECTION_LEFT) {
          // Teleport immediately to the right side
          this.x = rightBorder - this.width;
      }
      // Check if Pacman touched the right edge
      else if (this.x + this.width >= rightBorder && this.direction === DIRECTION_RIGHT) {
          // Teleport immediately to the left side
          this.x = 0;
      }
  }

  eat() {
      for (let i = 0; i < map.length; i++) {
          for (let j = 0; j < map[0].length; j++) {
              if (
                  map[i][j] == 2 &&
                  this.getMapX() == j &&
                  this.getMapY() == i
              ) {
                  map[i][j] = 3;
                  score++;
              }
          }
      }
  }

  moveBackwards() {
      switch (this.direction) {
          case DIRECTION_RIGHT: // Right
              this.x -= this.speed;
              break;
          case DIRECTION_UP: // Up
              this.y += this.speed;
              break;
          case DIRECTION_LEFT: // Left
              this.x += this.speed;
              break;
          case DIRECTION_BOTTOM: // Bottom
              this.y -= this.speed;
              break;
      }
  }

  moveForwards() {
      switch (this.direction) {
          case DIRECTION_RIGHT: // Right
              this.x += this.speed;
              break;
          case DIRECTION_UP: // Up
              this.y -= this.speed;
              break;
          case DIRECTION_LEFT: // Left
              this.x -= this.speed;
              break;
          case DIRECTION_BOTTOM: // Bottom
              this.y += this.speed;
              break;
      }
  }

  checkCollisions() {
      let isCollided = false;
      if (
          map[parseInt(this.y / oneBlockSize)][
              parseInt(this.x / oneBlockSize)
          ] == 1 ||
          map[parseInt(this.y / oneBlockSize + 0.9999)][
              parseInt(this.x / oneBlockSize)
          ] == 1 ||
          map[parseInt(this.y / oneBlockSize)][
              parseInt(this.x / oneBlockSize + 0.9999)
          ] == 1 ||
          map[parseInt(this.y / oneBlockSize + 0.9999)][
              parseInt(this.x / oneBlockSize + 0.9999)
          ] == 1
      ) {
          isCollided = true;
      }
      return isCollided;
  }

  checkGhostCollision(ghosts) {
      for (let i = 0; i < ghosts.length; i++) {
          let ghost = ghosts[i];
          if (
              ghost.getMapX() == this.getMapX() &&
              ghost.getMapY() == this.getMapY()
          ) {
              return true;
          }
      }
      return false;
  }

  changeDirectionIfPossible() {
      if (this.direction == this.nextDirection) return;
      
      let tempDirection = this.direction;
      this.direction = this.nextDirection;
      this.moveForwards();
      if (this.checkCollisions()) {
          this.moveBackwards();
          this.direction = tempDirection;
      } else {
          this.moveBackwards();
      }
  }

  getMapX() {
      let mapX = parseInt(this.x / oneBlockSize);
      return mapX;
  }

  getMapY() {
      let mapY = parseInt(this.y / oneBlockSize);

      return mapY;
  }

  getMapXRightSide() {
      let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
      return mapX;
  }

  getMapYRightSide() {
      let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
      return mapY;
  }

  changeAnimation() {
      this.currentFrame =
          this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  draw() {
      canvasContext.save();
      canvasContext.translate(
          this.x + oneBlockSize / 2,
          this.y + oneBlockSize / 2
      );
      canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
      canvasContext.translate(
          -this.x - oneBlockSize / 2,
          -this.y - oneBlockSize / 2
      );
      canvasContext.drawImage(
          pacmanFrames,
          (this.currentFrame - 1) * oneBlockSize,
          0,
          oneBlockSize,
          oneBlockSize,
          this.x,
          this.y,
          this.width,
          this.height
      );
      canvasContext.restore();
  }
}
