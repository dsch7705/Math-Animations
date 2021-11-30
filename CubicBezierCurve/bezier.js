/// <reference path="./p5.global-mode.d.ts"/>

// Created by Dylan Schooner using p5.js

let segments = 5;
let clock = 0;

var showLines;
var showPoints;
var lineThickness;
var resolution;

var p1PosX = 225;
var p1PosY = 50;
var p2PosX = 575;
var p2PosY = 50;

let mouseClose1 = false;
let locked1 = false;
let mouseClose2 = false;
let locked2 = false;
let canvas;

let lineColor;

function setup() {
  text("text", 0, 0);
  canvas = createCanvas(800, 500);
  canvas.position(windowWidth/2 - width/2, windowHeight/2 - height/2);

  showLines = createCheckbox("Show lines", false);
  showLines.position(windowWidth / 3, windowHeight / 2 + height / 2);
  showPoints = createCheckbox("Show anchor/control points", true);
  showPoints.position(windowWidth / 3, windowHeight / 2 + height / 2 + 20);
  lineThickness = createSlider(2, 12, 7);
  lineThickness.position(windowWidth / 3 + 250, windowHeight / 2 + height / 2);
  resolution = createSlider(1, 50, 25);
  resolution.position(windowWidth / 3 + 250, windowHeight / 2 + height / 2 + 20);
}

function windowResized() {
  canvas.position(windowWidth/2 - width/2, windowHeight/2 - height/2);
  showLines.position(windowWidth / 3, windowHeight / 2 + height / 2);
  showPoints.position(windowWidth / 3, windowHeight / 2 + height / 2 + 20);
  lineThickness.position(windowWidth / 3 + 250, windowHeight / 2 + height / 2);
  resolution.position(windowWidth / 3 + 250, windowHeight / 2 + height / 2 + 20);
}

function draw() {
  background(220);
  
  clock += deltaTime / 1000;
  
  let p0 = createVector(250, 250);
  let p1 = createVector(p1PosX, p1PosY);
  let p2 = createVector(p2PosX, p2PosY);
  let p3 = createVector(550, 250);
  
  strokeWeight(2)
  stroke(0, 0, 0, 128)
  if (showLines.checked()) {
    line(p0.x, p0.y, p1.x, p1.y)
    line(p1.x, p1.y, p2.x, p2.y)
    line(p2.x, p2.y, p3.x, p3.y)
  }

  // Draw all points for lerp
  segments = resolution.value();
  
  noFill();
  beginShape();
  for (let i = 0; i <= segments; i++) {
    let x1 = interpolate(p0, p1, i);
    let x2 = interpolate(p1, p2, i);
    let x3 = interpolate(p2, p3, i);
    let y1 = interpolate(x1, x2, i);
    let y2 = interpolate(x2, x3, i);
    let curve = interpolate(y1, y2, i);
    vertex(curve.x, curve.y);
    if (showPoints.checked()) {
      strokeWeight(10);
      point(p0);
      stroke(255, 255, 0)
      rect(p1.x, p1.y, 1);
      rect(p2.x, p2.y, 1);
      stroke(0);
      point(p3);
      strokeWeight(2);
      point(curve);
    }
  }
  stroke(color('#e64965'))
  strokeWeight(lineThickness.value())
  endShape();
  
  // Mouse proximity detection
  if (abs(p1.x - mouseX) < 5 && abs(p1.y - mouseY) < 5) {
    mouseClose1 = true;
  } else {
    mouseClose1 = false;
  }
  
  if (abs(p2.x - mouseX) < 5 && abs(p2.y - mouseY) < 5) {
    mouseClose2 = true;
  } else {
    mouseClose2 = false;
  }
}

// Linear interpolation function
function interpolate(p0, p1, t) {
  p = createVector(p0.x + t * (p1.x - p0.x) / segments, p0.y + t * (p1.y - p0.y) / segments)
  return (p);
}

function mousePressed() {
  if (mouseClose1) {
    locked1 = true;
  } else if (mouseClose2) {
    locked2 = true;
  }
}

function mouseDragged() {
  if (locked1) {
    p1PosX = mouseX;
    p1PosY = mouseY;
  } else if (locked2) {
    p2PosX = mouseX;
    p2PosY = mouseY;
  }
}

function mouseReleased() {
  locked1 = false;
  locked2 = false;
}
