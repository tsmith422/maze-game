let name;
let screenWidth = 1920;
let screenHeight = 1080;
let button, start;
let flag,
  resizeFlag,
  adjustFlag,
  isFullScreen = false;
let setSpawn = true;
let buttonHeight;
let buttonWidth;
let goal;
let player;
let song, knock, ding;
let level = 0;
let count = 1;
let waitToggle = 0;
let ms = 5000;
let timerSeconds = 0;
let timerMins = 0;
let showImage = false;
let size1 = 720;
let size2 = 480;
let knockFlag = true;
let walkFlag = true;
let laserFlag = false;
let laserFlag2 = false;
let flag2 = false;
let title = ["M", "a", "z", "e ", "G", "a", "m", "e"];

/* this functions loads all of the audio and images before the program
 * starts so there are no errors
 */
function preload() {
  // Audio
  song = createAudio("Sounds and Images/Title Music.mp3");
  song2 = createAudio("Sounds and Images/white-noise.mp3");
  knock = createAudio("Sounds and Images/knock.mp3");
  knock2 = createAudio("Sounds and Images/knock2.mp3");
  knock3 = createAudio("Sounds and Images/knock3.mp3");
  ding = createAudio("Sounds and Images/ding.mp3");
  jump = createAudio("Sounds and Images/jumpscare.mp3");
  heartbeat = createAudio("Sounds and Images/heartbeat.mp3");

  // Image
  scare = loadImage("Sounds and Images/mosquito-removebg-preview.png");
}

function setup() {
  createCanvas(720, 480);
  name = window.prompt("Enter your name: ");
  name = trim(name + "");
  while (name == "null" || name == "") {
    name = window.prompt("Please enter your name/nickname: ");
    name = trim(name + "");
    if (name == "null") {
      name = "";
    }
    if (name != "") {
      break;
    }
  }
  // frameRate limiting allows for smoother animations
  frameRate(60);

  // fullscreen button setup
  button = createButton("Fullscreen");
  button.style("font-size", "32px");
  button.style("background-color", "#54555e");
  button.style("center");
  button.mousePressed(pressedTheButton);
  button.size(180, 50);

  // crosshair
  if (mouseX < width && mouseY < height) {
    cursor(CROSS);
  }

  // this plays the first song as soon as the program starts
  song.autoplay();
  song.volume(0);
  song.loop();

  /* player, the player is initialized in the setup because the
  dimensions will not change, only the position */
  player = new Player(100, 100, 50, 50, "#0324fc");
}

/* this is the loop for the knocking sound that signifies
 * if the player moves after the knock or not. I used
 * recursion because the function setTimeout will only
 * happen the first time it was called, so it will not
 * work in a typical loop.
 */

function waitLoop() {
  var tempX;
  var tempY;
  setTimeout(function () {
    // the setTimeouts in the if statements give the player time to stop moving
    if (level == 1) {
      knock.play();
      setTimeout(function () {
        tempX = player.getX();
        tempY = player.getY();
      }, 500);
    } else if (level == 2) {
      knock.play();
      setTimeout(function () {
        tempX = player.getX();
        tempY = player.getY();
      }, 500);
    } else if (level == 3) {
      knock2.play();
      setTimeout(function () {
        tempX = player.getX();
        tempY = player.getY();
      }, 300);
    } else if (level == 4) {
      knock3.play();
      setTimeout(function () {
        tempX = player.getX();
        tempY = player.getY();
      }, 220);
    }

    /* this checks to see if the player has moved after the knocking
     * sound que played.
     */
    setTimeout(function () {
      if (level > 0 && level < 5) {
        if (
          player.getX() + player.getWidth() > tempX + 150 ||
          player.getX() - player.getWidth() < tempX - 150 ||
          player.getY() + player.getHeight() > tempY + 150 ||
          player.getY() - player.getHeight() < tempY - 150
        ) {
          if (level == 1) {
            setSpawn = true;
          } else if (level > 1 && level < 5) {
            showImage = true;
            setSpawn = true;
          }
        } else {
          ding.play();
        }
      }
    }, 3000);
    // as you go into later levels, the knocks occur more often
    if (level == 1) {
      ms = int(random(8000, 9001));
    } else if (level == 2) {
      ms = int(random(5000, 8001));
    } else if (level == 3) {
      ms = int(random(5000, 5501));
    } else if (level == 4) {
      ms = int(random(5500, 6101));
    }
    /* this setTimeout is used to give the player a small time to
     * recover until the next knock is played
     */
    if (showImage) {
      setTimeout(function () {
        waitLoop();
      }, 1500);
    } else if (level < 5) waitLoop();
  }, ms);
}

// the countLoop uses recursion to make the timer work functionally
function countLoop() {
  setTimeout(function () {
    if (timerSeconds < 59 && level != 5) {
      timerSeconds++;
    } else if (level != 5) {
      timerSeconds = 0;
      timerMins++;
    }
    if (level != 5) {
      countLoop();
    }
  }, 1000);
}

// this knockLoop is what plays the knocking sound in the instructions
function knockLoop() {
  if (level == -1) {
    setTimeout(function () {
      if (level == -1) {
        knock.play();
        setTimeout(function () {
          walkFlag = false;
        }, 500);
      }
      setTimeout(function () {
        if (level == -1) {
          ding.play();
        }
        setTimeout(function () {
          walkFlag = true;
          knockLoop();
        }, 250);
      }, 1500);
    }, 2000);
  }
}

// the function detectWall was used to make collision in the blocks much easier
// the parameter 'p' stands for the player and the parameter 'b' stands for the block
function detectWall(p, b) {
  if (p.isTouchingTop(p, b)) {
    p.changeY(3);
  } else if (p.isTouchingBottom(p, b)) {
    p.changeY(-3);
  } else if (p.isTouchingRight(p, b)) {
    p.changeX(-3);
  } else if (p.isTouchingLeft(p, b)) {
    p.changeX(3);
  }
}

/* the adjust function was used to make the program much shorter and easier to read
 * it is used to set the first paramter 'block' to an x position, y position, set its
 * width and set its height.
 */
function adjust(block, x, y, width, height) {
  block.setX(x);
  block.setY(y);
  block.setWidth(width);
  block.setHeight(height);
}

// the  draw function is the main part of the program
function draw() {
  // Blocks
  /* I use a boolean here to update the position of the block everytime the
   * player goes in and out of fullscreen
   */
  if (!resizeFlag) {
    goal = new Block(
      width - 160,
      int(height / 2) + int(height / 4) + 68,
      70,
      70,
      "#07d400"
    );
    goal2 = new Block(
      width - 160,
      int(height / 2) + int(height / 4) + 68,
      70,
      70,
      "#07d400"
    );
    goal3 = new Block(
      width - 160,
      int(height / 2) + int(height / 4) + 68,
      70,
      70,
      "#07d400"
    );
    /* the blocks were initialized in the draw function because their position,
     * width,and height change throughout the program.
     */
    block1 = new Block(0, 0, width, 50, "black");
    block2 = new Block(0, 0, 50, height, "black");
    block3 = new Block(width / 2 - 300, height / 2 - 50, 1050, height, "black");
    block4 = new Block(0, height - 50, width, 50, "black");
    block5 = new Block(width - 50, 0, 50, height, "black");
    block6 = new Block(300, 0, 100, height - 200, "black");
    block7 = new Block(width / 2 - 300, 250, 500, height, "black");
    block8 = new Block(1400, 0, width, 300, "black");
    block9 = new Block(0, 0, 0, 0, "black");
    block10 = new Block(0, 0, 0, 0, "black");
    block11 = new Block(0, 0, 0, 0, "black");
    block12 = new Block(0, 0, 0, 0, "black");
    block13 = new Block(0, 0, 0, 0, "black");
    laser = new Block(0, 0, 0, 0, "red");
    laser2 = new Block(0, 0, 0, 0, "red");
    fsBlock = new Block(
      0,
      height - button.height,
      button.width,
      button.height,
      "black"
    );
    resizeFlag = true;
  }

  // fullscreen button
  button.position(0, height - button.height);
  if (
    mouseX > button.x &&
    mouseX < button.x + button.width &&
    mouseY > button.y &&
    mouseY < button.y + button.height
  ) {
    /* the button style was used to make the button highlight so the player
     * knows they are going to select that button.
     */
    button.style("background-color", "#6d6e7d");
  } else {
    button.style("background-color", "#54555e");
  }

  if (level == -3) {
    //  ------------- LEVEL -3 --------------

    // left and right button setup
    if (flag) {
      song.volume(0.3);
      player.setX(910);
      player.setY(800);

      left = createButton("<");
      left.style("font-size", "32px");
      left.style("background-color", "#54555e");
      left.style("center");
      left.mousePressed(function () {
        level--;
        left.remove();
        right.remove();
        if (level == -4) {
          level = 0;
        }
      });
      left.size(50, 70);

      right = createButton(">");
      right.style("font-size", "32px");
      right.style("background-color", "#54555e");
      right.style("center");
      right.mousePressed(function () {
        level++;
        right.remove();
        left.remove();
      });
      right.size(50, 70);
      flag = false;
    }

    // left and right buttons position and glow effect
    left.position(0, height / 2);
    if (
      mouseX >= left.x &&
      mouseX <= left.x + left.width &&
      mouseY >= left.y &&
      mouseY <= left.y + left.height
    ) {
      left.style("background-color", "#6d6e7d");
    } else {
      left.style("background-color", "#54555e");
    }

    right.position(width - right.width, height / 2);
    if (
      mouseX >= right.x &&
      mouseX <= right.x + right.width &&
      mouseY >= right.y &&
      mouseY <= right.y + right.height
    ) {
      right.style("background-color", "#6d6e7d");
    } else {
      right.style("background-color", "#54555e");
    }

    // player movement demo
    background("teal");
    fill(100);
    rect(width / 2 - 200, 700, 300, 200);
    player.createPlayer();
    player.movement();
    // boundaries
    if (player.getX() + player.getWidth() - 3 > int(width / 2) + 120) {
      player.changeX(-3);
    } else if (player.getX() + 5 < int(width / 2) - 170) {
      player.changeX(3);
    }
    if (player.getY() + player.getHeight() - 3 > 920) {
      player.changeY(-3);
    } else if (player.getY() + 3 < 730) {
      player.changeY(3);
    }

    // this is the text for the first page of instructions
    fill(0);
    textSize(100);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text("Instructions Pg: 1", width / 2, 25);
    textSize(50);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text(
      "Use WASD Keys or the Arrow Keys to move.",
      width / 2,
      height / 2 - 100
    );
    text("Use the mouse to press grey buttons and", width / 2, height / 2 - 50);
    text("to go in and out of fullscreen.", width / 2, height / 2);
  } else if (level == -2) {
    //  ------------- LEVEL -2 -------------

    // left and right button setup
    if (!flag) {
      song.volume(0.3);

      left = createButton("<");
      left.style("font-size", "32px");
      left.style("background-color", "#54555e");
      left.style("center");
      left.mousePressed(function () {
        level--;
        left.remove();
        right.remove();
        if (level == -4) {
          level = 0;
        }
      });
      left.size(50, 70);

      right = createButton(">");
      right.style("font-size", "32px");
      right.style("background-color", "#54555e");
      right.style("center");
      right.mousePressed(function () {
        level++;
        right.remove();
        left.remove();
      });
      right.size(50, 70);
      knockFlag = true;
      flag = true;
    }

    // left and right buttons position and glow effect
    left.position(0, height / 2);
    if (
      mouseX >= left.x &&
      mouseX <= left.x + left.width &&
      mouseY >= left.y &&
      mouseY <= left.y + left.height
    ) {
      left.style("background-color", "#6d6e7d");
    } else {
      left.style("background-color", "#54555e");
    }

    right.position(width - right.width, height / 2);
    if (
      mouseX >= right.x &&
      mouseX <= right.x + right.width &&
      mouseY >= right.y &&
      mouseY <= right.y + right.height
    ) {
      right.style("background-color", "#6d6e7d");
    } else {
      right.style("background-color", "#54555e");
    }

    // text for the second page of instructions
    background("teal");
    fill(0);
    textSize(100);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text("Instructions Pg: 2", width / 2, 25);
    textSize(50);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text(
      "This game must be played in fullscreen and ",
      width / 2,
      height / 2 - 100
    );
    text(
      "with audio on, headphones are highly recommended.",
      width / 2,
      height / 2 - 50
    );
    text("(If you cannot hear music right now,", width / 2, height / 2 + 50);
    text(
      "please refer to the Read Me.txt in the program)",
      width / 2,
      height / 2 + 100
    );

    text("Press 'Ctrl' and '-' until you", width / 2, height / 2 + 200);
    text("can see both red squares in the top", width / 2, height / 2 + 250);
    text("corners of the screen.", width / 2, height / 2 + 300);

    /* rectangles in the top left and top right corners of the screen for
     * the player to check their screen size with.
     */
    fill("red");
    rect(0, 0, 50, 50);
    rect(screenWidth - 50, 0, 50, 50);
  } else if (level == -1) {
    //  ------------- LEVEL -1 --------------

    adjust(goal, 1200, height - 240, 70, 70);

    /* a boolean is used for this because the draw() function
     * is a loop and since I used recursion in the knockLoop()
     * function, the function should only be called once.
     */
    if (knockFlag) {
      knockLoop();
      song.volume(0.1);
      knockFlag = false;
    }
    // left and right button setup
    if (flag) {
      player.setX(500);
      player.setY(height - 200);

      left = createButton("<");
      left.style("font-size", "32px");
      left.style("background-color", "#54555e");
      left.style("center");
      left.mousePressed(function () {
        level--;
        left.remove();
        right.remove();
        if (level == -4) {
          level = 0;
        }
      });
      left.size(50, 70);

      right = createButton(">");
      right.style("font-size", "32px");
      right.style("background-color", "#54555e");
      right.style("center");
      right.mousePressed(function () {
        level++;
        right.remove();
        left.remove();
      });
      right.size(50, 70);
      flag = false;
    }

    // left and right buttons position and glow effect
    left.position(0, height / 2);
    if (
      mouseX >= left.x &&
      mouseX <= left.x + left.width &&
      mouseY >= left.y &&
      mouseY <= left.y + left.height
    ) {
      left.style("background-color", "#6d6e7d");
    } else {
      left.style("background-color", "#54555e");
    }

    right.position(width - right.width, height / 2);
    if (
      mouseX >= right.x &&
      mouseX <= right.x + right.width &&
      mouseY >= right.y &&
      mouseY <= right.y + right.height
    ) {
      right.style("background-color", "#6d6e7d");
    } else {
      right.style("background-color", "#54555e");
    }

    /* this makes the demo of the player going to the goal and stopping when
     * there is a knock.
     */
    background("teal");
    fill(100);
    rect(450, height - 300, 900, 180);
    goal.createRect();
    player.createPlayer();
    if (walkFlag) {
      player.changeX(1);
    }
    /* this sends the player back to the beginning after reaching the goal so
     * it is a proper loop.
     */
    if (player.getX() + player.getWidth() + 5 > 1230) {
      player.setX(500);
    }

    // text for the third page of the instructions
    fill(0);
    textSize(100);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text("Instructions Pg: 3", width / 2, 25);
    textSize(50);
    textStyle(NORMAL);
    textAlign(CENTER, CENTER);
    text(
      "In this game, you must reach the green square to make it",
      width / 2,
      height / 2 - 250
    );
    text(
      "to the end of each level without being caught while attempting",
      width / 2,
      height / 2 - 200
    );
    text(
      "to go as fast as you can; you will be timed.",
      width / 2,
      height / 2 - 150
    );
    text(
      "You will hear three consecutive knocks throughout every level,",
      width / 2,
      height / 2 - 50
    );
    text("stop moving before you hear the third knock,", width / 2, height / 2);
    text(
      "or else you will be sent back to the beginning",
      width / 2,
      height / 2 + 50
    );
    text(
      "of the level; continue moving once you hear a ding.",
      width / 2,
      height / 2 + 100
    );
  } else if (level == 0) {
    //  ------------- LEVEL 0 -------------

    background("#003a96");
    fill(0);
    textSize(200);
    textStyle(BOLD);
    textAlign(CENTER, TOP);

    if (!flag) {
      song.volume(0.3);

      // animation for title name
      for (var i = 0; i < title.length; i++) {
        text(title[i], 400 + i * 145, 25);
        if (i == title.length - 1) {
          flag2 = true;
        }
      }

      // title buttons setup
      instructions = createButton("Instructions");
      instructions.style("font-size", "70px");
      instructions.style("background-color", "#54555e");
      instructions.style("center");
      instructions.mousePressed(function () {
        level = -3;
        instructions.remove();
        start.remove();
      });
      instructions.size(400, 100);

      start = createButton("Start");
      start.style("font-size", "70px");
      start.style("background-color", "#54555e");
      start.style("center");
      start.mousePressed(function () {
        level = 1;
        start.remove();
        instructions.remove();
      });
      start.size(200, 100);

      flag = true;
    }
    // glow effect for the start button
    start.position(width / 2 - start.width / 2, height / 2 - 150);
    if (
      mouseX >= start.x &&
      mouseX <= start.x + start.width &&
      mouseY >= start.y &&
      mouseY <= start.y + start.height
    ) {
      start.style("background-color", "#6d6e7d");
    } else {
      start.style("background-color", "#54555e");
    }

    // glow effect for the instrustions button
    instructions.position(width / 2 - instructions.width / 2, height / 2 + 100);
    if (
      mouseX >= instructions.x &&
      mouseX <= instructions.x + instructions.width &&
      mouseY >= instructions.y &&
      mouseY <= instructions.y + instructions.height
    ) {
      instructions.style("background-color", "#6d6e7d");
    } else {
      instructions.style("background-color", "#54555e");
    }
    // this makes it so the title screen shows after the animation
    if (flag2) {
      text("Maze Game", width / 2, 25);
    }

    //this resets the text attributes
    fill(0);
    textSize(32);
    textStyle(NORMAL);
    textAlign(CENTER);
  } else if (level == 1) {
    //      ------------- LEVEL 1 -------------

    background("green");
    song.volume(0.08);
    /* the flag boolean is used throughout the program to ensure some things only
     * occur once since the draw function is an infinite loop.
     */
    if (flag) {
      waitLoop();
      countLoop();
      flag = false;
    }

    // initializing the walls
    block1.createRect();
    block2.createRect();
    block3.createRect();
    block4.createRect();
    block5.createRect();
    block6.createRect();
    block7.createRect();
    block8.createRect();
    fsBlock.createRect();

    // initializing the goal and adjusting its position
    adjust(goal, width - 160, int(height / 2) + int(height / 4) + 68, 70, 70);
    goal.createRect();

    /* this sends the player back to the beginning of the level if they move
     * after the knock.
     */
    if (setSpawn) {
      player.setX(165);
      player.setY(165);
      setSpawn = false;
    }

    // this initializes the player
    player.createPlayer();
    // this methods gives the player the ability to move
    player.movement(player);

    // name text
    textSize(32);
    fill(250);
    text(name, player.getX(), player.getY() - 55);

    // block collision
    detectWall(player, block1);
    detectWall(player, block2);
    detectWall(player, block3);
    detectWall(player, block4);
    detectWall(player, block5);
    detectWall(player, block6);
    detectWall(player, block7);
    detectWall(player, block8);
    detectWall(player, fsBlock);

    // goal collision
    if (
      player.isTouchingBottom(player, goal) ||
      player.isTouchingTop(player, goal) ||
      player.isTouchingLeft(player, goal) ||
      player.isTouchingRight(player, goal)
    ) {
      song.pause();
      setSpawn = true;
      level = 2;
    }
  } else if (level == 2) {
    //    ------------- LEVEL 2 -------------

    background("purple");

    // walls
    block1.createRect();
    block2.createRect();
    block3.createRect();
    block4.createRect();
    block5.createRect();
    block6.createRect();
    block7.createRect();
    block8.createRect();
    block9.createRect();
    fsBlock.createRect();

    // goal
    goal.createRect();

    /* this sends the player back to the beginning of the level if they move
     * after the knock.
     */
    if (setSpawn) {
      player.setX(width - 165);
      player.setY(165);
      setSpawn = false;
    }
    player.createPlayer();
    player.movement(player);

    // name text
    textSize(32);
    fill(250);
    text(name, player.getX(), player.getY() - 55);

    // block collision
    detectWall(player, block1);
    detectWall(player, block2);
    detectWall(player, block3);
    detectWall(player, block4);
    detectWall(player, block5);
    detectWall(player, block6);
    detectWall(player, block7);
    detectWall(player, block8);
    detectWall(player, block9);
    detectWall(player, fsBlock);

    // goal collision
    if (
      player.isTouchingBottom(player, goal) ||
      player.isTouchingTop(player, goal) ||
      player.isTouchingLeft(player, goal) ||
      player.isTouchingRight(player, goal)
    ) {
      song.pause();
      setSpawn = true;
      level = 3;
    }

    if (!flag) {
      song2.play();
      song2.volume(0.5);
      song2.loop();
      flag = true;
    }

    /* the adjust function simply changes the x, y, width, and height of the first
     * parameter.
     */
    adjust(block1, 0, 0, width, 50);
    adjust(block2, 0, 0, 50, height);
    adjust(block3, width - 50, 0, 50, height);
    adjust(block4, 0, height - 50, width, 50);
    adjust(block5, 300, 0, 200, height - 300);
    adjust(block6, 750, 300, width, 100);
    adjust(block7, 750, 300, 400, 300);
    adjust(block8, 300, height - 300, width - 600, 100);
    adjust(block9, width - 600, height - 500, 300, 200);
    adjust(goal, 140, 140, 70, 70);
  } else if (level == 3) {
    //     ------------- LEVEL 3 -------------

    background("black");

    // walls
    block1.createRect();
    block2.createRect();
    block3.createRect();
    block4.createRect();
    block5.createRect();
    block6.createRect();
    block7.createRect();
    block8.createRect();
    block9.createRect();
    block10.createRect();
    block11.createRect();
    block12.createRect();
    block13.createRect();
    fsBlock.createRect();

    // goals
    goal.createRect();
    goal2.createRect();
    goal3.createRect();

    // person
    if (setSpawn) {
      player.setX(width - 165);
      player.setY(height - 165);
      setSpawn = false;
    }
    player.createPlayer();
    player.movement(player);

    // name text
    textSize(32);
    fill(250);
    text(name, player.getX(), player.getY() - 55);

    // block collision
    detectWall(player, block1);
    detectWall(player, block2);
    detectWall(player, block3);
    detectWall(player, block4);
    detectWall(player, block5);
    detectWall(player, block6);
    detectWall(player, block7);
    detectWall(player, block8);
    detectWall(player, block9);
    detectWall(player, block10);
    detectWall(player, block11);
    detectWall(player, block12);
    detectWall(player, block13);
    detectWall(player, fsBlock);

    // goal collision
    if (
      player.isTouchingBottom(player, goal) ||
      player.isTouchingTop(player, goal) ||
      player.isTouchingLeft(player, goal) ||
      player.isTouchingRight(player, goal)
    ) {
      setSpawn = true;
      level = 4;
    }
    // this is a fake goal
    if (
      player.isTouchingBottom(player, goal2) ||
      player.isTouchingTop(player, goal2) ||
      player.isTouchingLeft(player, goal2) ||
      player.isTouchingRight(player, goal2)
    ) {
      setSpawn = true;
      level = 3;
    }
    // this is a fake goal
    if (
      player.isTouchingBottom(player, goal3) ||
      player.isTouchingTop(player, goal3) ||
      player.isTouchingLeft(player, goal3) ||
      player.isTouchingRight(player, goal3)
    ) {
      setSpawn = true;
      level = 3;
    }

    // setting the position and size of the walls
    adjust(block1, 0, 0, width, 50);
    adjust(block2, 0, 0, 50, height);
    adjust(block3, width - 50, 0, 50, height);
    adjust(block4, 0, height - 50, width, 50);
    adjust(block5, 1100, int(height / 2) + 100, width, 200);
    adjust(block6, 1400, 0, width, int(height / 2) + 200);
    adjust(block7, 500, 0, width, 400);
    adjust(block8, 500, int(height / 2) + 100, 300, 150);
    adjust(block9, 720, int(height / 2) + 100, 150, height);
    adjust(block10, 400, height - 170, 170, 120);
    adjust(block11, 0, int(height / 2) + 70, 200, 280);
    adjust(block12, 0, 210, 300, 100);
    adjust(block13, 210, 220, 90, 200);
    adjust(goal, 100, 100, 70, 70);
    adjust(goal2, width - 100, 100, 70, 70);
    adjust(goal3, width / 2 - 350, height - 140, 70, 70);

    // instructions for the level
    if (flag) {
      fill(250);
      textAlign(CENTER);
      textSize(50);
      text(
        "Find the correct exit through the dark.",
        width / 2,
        height / 2 - 100
      );
      setTimeout(function () {
        flag = false;
      }, 3000);
    }
  } else if (level == 4) {
    //     ------------- LEVEL 4 -------------

    background("#381111");

    // walls
    block1.createRect();
    block2.createRect();
    block3.createRect();
    block4.createRect();
    block5.createRect();
    block6.createRect();
    block7.createRect();
    block8.createRect();
    block9.createRect();
    laser.createRect();
    laser2.createRect();
    fsBlock.createRect();

    // goal
    goal.createRect();

    // person
    if (setSpawn) {
      player.setX(225);
      player.setY(height - 165);
      setSpawn = false;
    }
    player.createPlayer();
    player.movement(player);

    // name text
    textSize(32);
    fill(250);
    text(name, player.getX(), player.getY() - 55);

    // block collision
    detectWall(player, block1);
    detectWall(player, block2);
    detectWall(player, block3);
    detectWall(player, block4);
    detectWall(player, block5);
    detectWall(player, block6);
    detectWall(player, block7);
    detectWall(player, block8);
    detectWall(player, block9);
    detectWall(player, fsBlock);

    // goal collision
    if (
      player.isTouchingBottom(player, goal) ||
      player.isTouchingTop(player, goal) ||
      player.isTouchingLeft(player, goal) ||
      player.isTouchingRight(player, goal)
    ) {
      setSpawn = true;
      level = 5;
    }

    // sets block (block name, x, y, width, height)
    adjust(block1, 0, 0, width, 50);
    adjust(block2, 0, 0, 50, height);
    adjust(block3, width - 50, 0, 50, height);
    adjust(block4, 0, height - 50, width, 50);
    adjust(block5, 400, 220, 200, height);
    adjust(block6, 400, 300, width - 800, 200);
    adjust(block7, 1300, 220, 300, 280);
    adjust(block8, 821, 220, 300, 280);
    adjust(block9, int(width / 2), int(height / 2) + 100, width, 150);
    adjust(goal, width - 200, height - 200, 70, 70);

    // conditionals for laser movement
    if (laser.getX() <= 400) {
      laserFlag = true;
    } else if (laser.getX() + laser.getWidth() >= 1600) {
      laserFlag = false;
    }

    if (laserFlag) {
      laser.setX(laser.getX() + 3);
    } else {
      laser.setX(laser.getX() - 3);
    }

    if (laser2.getY() <= int(height / 2) + 250) {
      laserFlag2 = true;
    } else if (laser2.getY() + laser2.getHeight() >= 1020) {
      laserFlag2 = false;
    }

    if (laserFlag2) {
      laser2.setY(laser2.getY() + 1);
    } else {
      laser2.setY(laser2.getY() - 1);
    }
    laser.setY(50);
    laser2.setX(int(width / 2) + 350);

    // lasers collision
    if (
      player.isTouchingBottom(player, laser) ||
      player.isTouchingTop(player, laser) ||
      player.isTouchingLeft(player, laser) ||
      player.isTouchingRight(player, laser)
    ) {
      setSpawn = true;
    }

    if (
      player.isTouchingBottom(player, laser2) ||
      player.isTouchingTop(player, laser2) ||
      player.isTouchingLeft(player, laser2) ||
      player.isTouchingRight(player, laser2)
    ) {
      setSpawn = true;
    }

    if (!flag) {
      song2.volume(1);
      adjust(laser, 400, 50, 100, 170);
      adjust(laser2, int(width / 2) + 350, int(height / 2) + 250, 250, 80);
      flag = true;
    }
    if (flag2) {
      fill(250);
      textAlign(CENTER);
      textSize(50);
      text("Do not touch the red lasers.", width / 2, height / 2 - 150);
      setTimeout(function () {
        flag2 = false;
      }, 3000);
    }
  } else if (level == 5) {
    //     ------------- LEVEL 5 -------------
    background("teal");
    song2.pause();
    textAlign(CENTER);
    textSize(100);
    text(
      "You finished in: " +
        timerMins +
        " min(s) and " +
        timerSeconds +
        " sec(s).",
      width / 2,
      height / 2 - 75
    );
    setTimeout(function () {
      flag2 = true;
    }, 2500);
    if (flag2) {
      text("Refresh the page to play again!", width / 2, height / 2 + 50);
    }
  }

  if (level > 0 && level < 5) {
    //timer
    textSize(32);
    fill(250);
    if (("" + timerSeconds).length < 2) {
      textAlign(CENTER);
      textSize(32);
      // this adds a leading zero if the seconds are in the ones place
      text(timerMins + ":0" + timerSeconds, width / 2, 12);
    } else {
      textSize(32);
      text(timerMins + ":" + timerSeconds, width / 2, 12);
    }

    // this is the jumpscare if you move after the knock
    if (showImage) {
      jump.play();
      jump.volume(1);
      image(scare, width / 2 - size1 / 2, height / 2 - size2 / 2, size1, size2);
      size1 = screenWidth;
      size2 = screenHeight;
      setTimeout(function () {
        heartbeat.volume(0.5);
        heartbeat.play();
        showImage = false;

        jump.stop();

        size1 = 720;
        size2 = 480;
      }, 1500);
    } else image(scare, width, 0);
  }
}

// this is the function for the fullscreen button
function pressedTheButton() {
  let fs = fullscreen();
  fullscreen(!fs);
  isFullScreen = !isFullScreen;
  if (isFullScreen) {
    resizeCanvas(screenWidth, screenHeight - 10);
    button.html("Esc Fullscreen");
    resizeFlag = false;
    buttonWidth = 250;
    button.size(250, 50);
  } else {
    resizeCanvas(720, 480);
    button.html("Fullscreen");
    buttonWidth = 180;
    button.size(180, 50);
  }
}
