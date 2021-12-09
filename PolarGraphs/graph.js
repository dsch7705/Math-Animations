let clock = 0;

let radius = 0
let pathRadius = 0;
let staticRadius = 170;
let vertices = []

let ucOverlap = 20;

let xPos = 0;
let yPos = 0;

let limaconButton;
let lemniscateButton;
let roseButton;
let spiralButton;
let func = "ROSE";

let canvas;
let amplitude;
let angleCoefficient;
let pathThickness;

function setup() {
  canvas = createCanvas(800, 500);
  canvas.position(windowWidth/2 - width/2, windowHeight/2 - height/2);
  
  limaconButton = createButton("Limacon");
  limaconButton.position(windowWidth / 4, windowHeight / 2 + height / 2 + 10);
  limaconButton.mousePressed(() => {
    func = "LIMACON";
    pathVertices();
  });

  lemniscateButton = createButton("Lemniscate");
  lemniscateButton.position(windowWidth / 4 + 70, windowHeight / 2 + height / 2 + 10);
  lemniscateButton.mousePressed(() => {
    func = "LEMNISCATE";
    pathVertices();
  });

  roseButton = createButton("Rose");
  roseButton.position(windowWidth / 4 + 158, windowHeight / 2 + height / 2 + 10);
  roseButton.mousePressed(() => {
    func = "ROSE";
    pathVertices();
  });

  spiralButton = createButton("Spiral");
  spiralButton.position(windowWidth / 4 + 210, windowHeight / 2 + height / 2 + 10);
  spiralButton.mousePressed(() => {
    func = "SPIRAL";
    pathVertices();
  });

  amplitude = createSlider(30, 180, 100);
  amplitude.position(windowWidth / 3 + 200, windowHeight / 2 + height / 2 + 10);

  angleCoefficient = createSlider(1, 10, 2);
  angleCoefficient.position(windowWidth / 3 + 335, windowHeight / 2 + height / 2 + 10);

  amplitude.input(pathVertices);
  angleCoefficient.input(pathVertices);

  pathThickness = createSlider(1, 10, 3);
  pathThickness.position(windowWidth / 3 + 470, windowHeight / 2 + height / 2 + 10);
  pathThickness.input(pathVertices);
  
  pathVertices();
}

function windowResized() {
  canvas.position(windowWidth/2 - width/2, windowHeight/2 - height/2);

  limaconButton.position(windowWidth / 4, windowHeight / 2 + height / 2 + 10);
  lemniscateButton.position(windowWidth / 4 + 70, windowHeight / 2 + height / 2 + 10);
  roseButton.position(windowWidth / 4 + 158, windowHeight / 2 + height / 2 + 10);
  spiralButton.position(windowWidth / 4 + 210, windowHeight / 2 + height / 2 + 10);
  amplitude.position(windowWidth / 3 + 200, windowHeight / 2 + height / 2 + 10);
  angleCoefficient.position(windowWidth / 3 + 335, windowHeight / 2 + height / 2 + 10);
  pathThickness.position(windowWidth / 3 + 470, windowHeight / 2 + height / 2 + 10);
}

function draw() {
  background(49, 77, 121);
  drawUCLines();
  push();
    drawPath();
  pop();
  updatePosition();
  
  text("r = " + int(radius * 1000) / 1000, width - 100, 50);
  text("Θ = " + int(clock * 1000) / 1000, width - 100, 65);

  noFill();
  circle(width / 2, height / 2, radius * 2);
  fill(0, 0, 0, 100);
  circle(xPos, yPos, 10);

}

function drawPath() {
  stroke(108, 212, 255);
  strokeWeight(pathThickness.value());
  for (let i = 0; i < vertices.length - 1; i++) {
    //vertex(vertices[i].x, vertices[i].y);
    line(vertices[i][0], vertices[i][1], vertices[i+1 % vertices.length][0], vertices[i+1 % vertices.length][1]);
    //vertex(vertices[i][0], vertices[i][1]);
  }
}

function pathVertices() {
  vertices.length = 0;
  for (let i = 0; i <= TWO_PI; i+= PI / 100) {
    switch (func) {
      case "LIMACON":
        vert = [width / 2 + cos(i) * limacon(amplitude.value(), angleCoefficient.value() * 20, i), height / 2 - sin(i) * limacon(amplitude.value(), angleCoefficient.value() * 20, i)];
        if (vert[0] == vert[1]) {
          continue;
        }
        break;
      case "LEMNISCATE":
        vert = [width / 2 + cos(i) * lemniscate(amplitude.value(), i), height / 2 - sin(i) * lemniscate(amplitude.value(), i)];
        break;
      case "ROSE":
        vert = [width / 2 + cos(i) * rose(amplitude.value(), angleCoefficient.value(), i), height / 2 - sin(i) * rose(amplitude.value(), angleCoefficient.value(), i)];
        break;
      case "SPIRAL":
        vert = [width / 2 + cos(i) * spiral(amplitude.value()  / 2, i), height / 2 - sin(i) * spiral(amplitude.value() / 2, i)];
        break;
    }
    vertices.push(vert);
  }
}

function updatePosition() {
  switch (func) {
    case "LIMACON":
      radius = limacon(amplitude.value(), angleCoefficient.value() * 20, clock);
      break;
    case "LEMNISCATE":
      radius = lemniscate(amplitude.value(), clock);
      break;
    case "ROSE":
      radius = rose(amplitude.value(), angleCoefficient.value(), clock);
      break;
    case "SPIRAL":
      radius = spiral(amplitude.value() / 2, clock);
      break;
  }
  xPos = width / 2 + cos(clock) * radius;
  yPos = height / 2 - sin(clock) * radius;
  drawRT();
  
  tickClock();
}

function tickClock() {
  clock += deltaTime / 1000;
  if (clock >= 2 * TWO_PI) {
    clock = 0;
  }
}

function updateEquation() {
  funcsList = split(func.value(), '(');
  console.log(funcsList);
  
  for (let i = 0; i < funcList.length; i ++) {
    switch (funcsList[i]) {
      case "cos":
        
    }
  }
}

function drawRT() {
  line(width / 2, height / 2, xPos, height / 2);
  line(xPos, height / 2, xPos, yPos);
  line(width / 2, height / 2, xPos, yPos);
}

function drawUCLines() {
  stroke(0, 0, 0, 50)
  let offset = staticRadius + ucOverlap;

  // Quadrantal
  line(width / 2 - offset, height / 2, width / 2 + offset, height / 2);
  line(width / 2, height / 2 - offset, width / 2, height / 2 + offset);
  
  // 45 degrees
  line(width / 2 + cos(PI / 4) * offset, height / 2 - sin(PI / 4) * offset, width / 2 - cos(PI / 4) * offset, height / 2 + sin(PI / 4) * offset);
  line(width / 2 + cos(PI / 4) * offset, height / 2 + sin(PI / 4) * offset, width / 2 - cos(PI / 4) * offset, height / 2 - sin(PI / 4) * offset);
  
  // 30 degrees
  line(width / 2 + cos(PI / 6) * offset, height / 2 - sin(PI / 6) * offset, width / 2 - cos(PI / 6) * offset, height / 2 + sin(PI / 6) * offset);
  line(width / 2 + cos(PI / 6) * offset, height / 2 + sin(PI / 6) * offset, width / 2 - cos(PI / 6) * offset, height / 2 - sin(PI / 6) * offset);
  
  // 60 degrees
  line(width / 2 + cos(PI / 3) * offset, height / 2 - sin(PI / 3) * offset, width / 2 - cos(PI / 3) * offset, height / 2 + sin(PI / 3) * offset);
  line(width / 2 + cos(PI / 3) * offset, height / 2 + sin(PI / 3) * offset, width / 2 - cos(PI / 3) * offset, height / 2 - sin(PI / 3) * offset);
}
