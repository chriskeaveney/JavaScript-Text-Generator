let textImg, font, gradient;
let inputText = 'Aches';

let objectDensity = 3;
let objectSlider;

let txtSizeDrop;
let txtSize = 150;
let textSlider;

let fr = 30;

let checkBox;
let inverted = false;

let circleRadius = 2;
let radiusSlider;

let backgroundColor = 0;

let xPos;
let yPos;

let startPos = [];
let endPos = [];

let checkBox2;
let noise = false;

let lerpQuantity = 0;
let easing = 0.00001;

let mouse;
let mouseShape = false;
let maxDistance;

let fall = false;
let speed = 0;
let gravity = 0.05;

// Preloads the font and gradient
function preload() {
    gradient = loadImage('data/gradient.png');
    font = loadFont("data/FreeSans.otf")
}

// Setup canvas and UI canvas components
function setup() {
  stroke(51);
  let cnv = createCanvas(700,700);
  cnv.parent('canvasHolder')
  frameRate(fr);
  maxDistance = dist(0, 0, width*2, height*2);

  textBox = createInput(inputText, 'text');
  textBox.addClass('form-control');
  textBox.parent('textController');
  textBox.changed(update);

  checkBox = createCheckbox('_INVERT', inverted);
  checkBox.parent('fillController');
  checkBox.changed(update);

  checkBox2 = createCheckbox('_NOISE', noise);
  checkBox2.parent('NoiseController');
  checkBox2.changed(update);

  radiusSlider = createSlider(1, 20, 2);
  radiusSlider.parent('radiusController')
  radiusSlider.input(update);

  objectSlider = createSlider(1, 20, 5);
  objectSlider.parent('densityController')
  objectSlider.input(update);

  // Dropdown list for text size
  txtSizeDrop = createSelect();
  txtSizeDrop.parent('txtSizeDrop');
  txtSizeDrop.option(150);
  txtSizeDrop.option(200);
  txtSizeDrop.option(250);
  txtSizeDrop.option(350);
  txtSizeDrop.option(700);
  txtSizeDrop.changed(update);

  mouse = createCheckbox('_MOUSE', mouseShape);
  mouse.parent('mouseController');
  mouse.changed(update);

  gravityBox = createCheckbox('_GRAVITY', fall);
  gravityBox.parent('mouseController');
  gravityBox.changed(update);

  // Load gradient pixels
  gradient.loadPixels();
  currentGradient = gradient.pixels;
  // Setup  the text
  setUpText();
  // Draw points from the text setup
  startPoints();
}

// StartPoints filters through the text image, and maps where the text is on the canvas,
// The text is not drawn but the function finds where it would be drawn on the canvas, and replaces this with points
function startPoints() {
    for(let y = 0; y < height; y += objectDensity) {
        for(let x = 0; x < width; x += objectDensity) {

            let index = (x + y * textImg.width) * 4;

            startPos[index] = {x: 0, y: 0};
            endPos[index] = {x: x, y: y};
        }
    }
}

function draw() {
  textAlign(CENTER);

  // Set the background color to the variable created
  background(backgroundColor);

    for(let y = 0; y < height; y += objectDensity) {
        for(let x = 0; x < width; x += objectDensity) {
            // Calculate the index for the pixels array from x and y
            let index = (x + y * textImg.width) * 4;
            // Get the red value from image
            let tr = textImg.pixels[index];

            // areaSize is defined as the distance from the x & y
            // coordinates to the mouse coordinates
            let size = dist(mouseX, mouseY, x, y);
            // This is then divided by the max distance and multiplied by 10
            size = (size/maxDistance) * 10;

            var dx = 1 - lerpQuantity;
            lerpQuantity += dx * easing;

            xPos = lerp(startPos[index].x, endPos[index].x, lerpQuantity);
            yPos = lerp(startPos[index].y, endPos[index].y, lerpQuantity);

            // If the red value is > 128, there should be text drawn at this co-ordinate
            // The point is created here
            if (tr < 128) {
              // If noise is checked
              if (noise) {
                  // x and y positions randomly change within the specified range
                  xPos = random(xPos-4, xPos+4);
                  yPos = random(yPos-4, yPos+4);
              }

              if (mouseShape) {
                  circleRadius = size;
              }

              // If gravity(fall) is checked
              if (fall) {
                  // Gravity is added to the speed of Y
                  yPos = yPos + speed;
                  speed = speed + gravity;
                  if (yPos > 700) {
                  speed = speed * -0.5;
                }
              }

              // If the variable 'inverted' is set to true
              if (inverted) {

                // Set the background variable to white
                backgroundColor = 255,255,255;

                // Change / Invert primary text colour
                // Black
                fill(0,0,0);
                ellipse(xPos-11,yPos,circleRadius,circleRadius);

                // Green
                fill(0, 100, 0, 150);
                ellipse(xPos-8,yPos,circleRadius,circleRadius);

                // Cyan
                fill(0, 255, 255, 150);
                ellipse(xPos-5,yPos,circleRadius,circleRadius);

                // Blue
                fill(0, 0, 255, 150, 150);
                ellipse(xPos-3,yPos,circleRadius,circleRadius);

                // Yellow
                fill(255, 255, 0, 150);
                ellipse(xPos,yPos,circleRadius,circleRadius);

                // Red
                fill(255, 0, 0);
                ellipse(xPos+5,yPos,circleRadius,circleRadius);
                noStroke()

              } else {

              // Set the background variable to black
              backgroundColor = 0;

              // textLeading((mouseY / width) * 350);
              // noStroke();

              // White
              fill(255,255,255);
              ellipse(xPos-11,yPos,2,2);

              // Green
              fill(0, 100, 0, 150);
              ellipse(xPos-8,yPos,circleRadius,circleRadius);

              // Cyan
              fill(0, 255, 255, 150);
              ellipse(xPos-5,yPos,circleRadius,circleRadius);

              // Blue
              fill(0, 0, 255, 150, 150);
              ellipse(xPos-3,yPos,circleRadius,circleRadius);

              // Yellow
              fill(255, 255, 0, 150);
              ellipse(xPos,yPos,circleRadius,circleRadius);

              // Red
              fill(255, 0, 0);
              ellipse(xPos+5,yPos,circleRadius,circleRadius);
              noStroke()

              }
            }
        }
    }
}

// Setup text image used to create the text shapes
function setUpText() {
  // Builds an offscreen graphics object to draw the text into
  textImg = createGraphics(760,500);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textSize(txtSize);
  textImg.textFont(font);
  textImg.textAlign(CENTER, CENTER);
  textImg.text(inputText, width/2, 80);
  textImg.loadPixels();
}

// When any values in the GUI are changed by the user, the update function is activated
function update() {
    // The value of each variable is set to the corrosponding slider vlaue
    // This is done to update the element value along with the value of the slider
    circleRadius = radiusSlider.value();
    inputText = textBox.value();
    inverted = checkBox.checked();
    noise = checkBox2.checked();
    mouseShape = mouse.checked();
    fall = gravityBox.checked();
    let size = txtSizeDrop.value();
    txtSize = int(size);
    objectDensity = objectSlider.value();
    // The text value is setup again assuming any values were changed
    setUpText();
    // Lastly, the points used to draw the lines are re-built with any altered values
    startPoints();
}
