class Block { 
  constructor(blockX, blockY, blockWidth, blockHeight, blockColor) {
    this.x = blockX;
    this.y = blockY;
    this.width = blockWidth;
    this.height = blockHeight;
    this.color = blockColor;
  }

  createRect() {
    // this creates the block using the parameters sent from the main program
    rectMode(CORNER);
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
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

  setX(a) {
    this.x = a;
  }

  setY(a) {
    this.y = a;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }
  
  setWidth(a){
    this.width = a;
  }
  
  setHeight(a){
    this.height = a;
  }

  getTop() {
    // left x, right x, top y
    return [this.x + 30, this.x + this.width + 20, this.y + 30];
  }

  getBottom() {
    // left x, right x, bottom y

    //print([this.x, this.x + this.width, this.y + this.height]);
    return [this.x + 30, this.x + this.width + 20, this.y + this.height + 20];
  }

  getLeft() {
    // left x, top y, bottom y
    return [this.x + 30, this.y + 30, this.y + this.height + 20];
  }

  getRight() {
    // right x, top y, bottom y
    return [this.x + this.width + 20, this.y + 30, this.y + this.height + 20];
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
