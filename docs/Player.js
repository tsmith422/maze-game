class Player {
  constructor(playerX, playerY, playerWidth, playerHeight, playerColor) {
    this.x = playerX;
    this.y = playerY;
    this.width = playerWidth;
    this.height = playerHeight;
    this.color = playerColor;
  }

  createPlayer() {
    // this creates the block using the parameters sent from the main program
    ellipseMode(CORNER);
    fill(this.color);
    ellipse(this.x - 25, this.y - 25, this.width, this.height);
  }

  /* below are all methods that help both me and the user 
  understand what is happening
  */
  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getTop() {
    // left x, right x, top y
    return [this.x, this.x + this.width, this.y];
  }

  getBottom() {
    // left x, right x, bottom y
    return [this.x, this.x + this.width, this.y + this.height];
  }

  getLeft() {
    // left x, top y, bottom y
    return [this.x, this.y, this.y + this.height];
  }

  getRight() {
    // right x, top y, bottom y
    return [this.x + this.width, this.y, this.y + this.height];
  }

  /* this method is used to allow user input to move the player
  with both the WASD keys and the Arrow keys through the 
  keyIsDown function*/
  movement(p) {
    if (keyIsDown(65) || keyIsDown(37)) {
      this.x -= 3;
    } else if (keyIsDown(68) || keyIsDown(39)) {
      this.x += 3;
    }
    if (keyIsDown(87) || keyIsDown(38)) {
      this.y -= 3;
    } else if (keyIsDown(83) || keyIsDown(40)) {
      this.y += 3;
    }

    // boundaries
    if (this.x + 10 >= width) this.x -= 3;
    else if (this.x - 10 <= 0) this.x += 3;
    if (this.y + 10 >= height) this.y -= 3;
    else if (this.y - 10 <= 0) this.y += 3;
  }

  /* these methods were used to return a boolean of whether or not
  the player is touching the side of a block, the parameter 'a' is
  the player and the parameter 'b' is the block we are checking*/

  isTouchingTop(a, b) {
    return (
      a.getTop()[1] >= b.getBottom()[0] &&
      a.getTop()[0] <= b.getBottom()[1] &&
      a.getTop()[2] - 5 <= b.getBottom()[2] &&
      a.getY() >= b.getY() + b.getHeight()
    );
  }

  isTouchingBottom(a, b) {
    return (
      a.getBottom()[1] >= b.getTop()[0] &&
      a.getBottom()[0] <= b.getTop()[1] &&
      a.getBottom()[2] + 6 >= b.getTop()[2] &&
      a.getY() <= b.getY() + b.getHeight()
    );
  }

  isTouchingLeft(a, b) {
    return (
      a.getLeft()[0] - 5 <= b.getRight()[0] &&
      a.getX() >= b.getX() + b.getWidth() &&
      a.getLeft()[2] >= b.getRight()[1] &&
      a.getLeft()[1] <= b.getRight()[2]
    );
  }

  isTouchingRight(a, b) {
    return (
      a.getRight()[0] + 6 >= b.getLeft()[0] &&
      a.getX() <= b.getX() + b.getWidth() &&
      a.getRight()[2] >= b.getLeft()[1] &&
      a.getRight()[1] <= b.getLeft()[2]
    );
  }

  changeX(a) {
    this.x += a;
  }

  changeY(a) {
    this.y += a;
  }

  setX(a) {
    this.x = a;
  }

  setY(a) {
    this.y = a;
  }

  // this was used to fix bugs with the collision detection
  getVertices() {
    print("Top Left: " + "(" + this.x + ", " + this.y + ")");
    print("Top Right: " + "(" + (this.x + this.width) + ", " + this.y + ")");
    print("Bottom Left: " + "(" + this.x + ", " + (this.y + this.height) + ")");
    print(
      "Bottom Right: " +
        "(" +
        (this.x + this.width) +
        ", " +
        (this.y + this.height) +
        ")"
    );
    console.log();
  }
}
