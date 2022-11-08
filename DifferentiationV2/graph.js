// Image buffers
var fx, dydx;
var buffer_width = 600; // In pixels

var graph_size = 20;
var unit_size;
var curve_resolution = 20;  // # of evaluations between each whole unit

var points = [];

var graph_pos = 0;
var user_selected = false;
var len_tan_line = 4; // In units

// UI 
var x_input;
var evaluate_button;
var follow_mouse_bool;
var function_select;

// Example functions
var fourier_square = '4sin(x)/PI+4sin(3x)/3PI+4sin(5x)/5PI+4sin(7x)/7PI+4sin(9x)/9PI+4sin(11x)/11PI+4sin(13x)/13PI+4sin(15x)/15PI+4sin(17x)/17PI+4sin(19x)/19PI+4sin(21x)/21PI+4sin(23x)/23PI';

var fourier_saw = 
'2sin(x)/-PI+2sin(2x)/2PI+2sin(3x)/-3PI+2sin(4x)/4PI+2sin(5x)/-5PI+2sin(6x)/6PI+2sin(7x)/-7PI+2sin(8x)/8PI+2sin(9x)/-9PI+2sin(10x)/10PI+2sin(11x)/-11PI+2sin(12x)/12PI'

function setup() {
  // Canvas and graphics buffers
  createCanvas(buffer_width*2, buffer_width);
  fx = createGraphics(buffer_width, buffer_width);
  dydx = createGraphics(buffer_width, buffer_width);
  
  fx.translate(fx.width/2, fx.height/2);
  dydx.translate(dydx.width/2, dydx.height/2)
  
  unit_size = fx.width/graph_size;
  
  // UI
  x_input = createInput()
  evaluate_button = createButton("Evaluate");
  follow_mouse_bool = createCheckbox("Follow mouse", false);
  function_select = createSelect();
  
  // UI functions
  // Evaluate derivative for given x input
  evaluate_button.mousePressed(() => {
    var x = (points.findIndex((element) => element[0].x == parseFloat(x_input.value())));
    follow_mouse_bool.checked(false);
    user_selected = true;
    graph_pos = x;
    
  }); 
  
  // Enable/disable user controlled graph position
  follow_mouse_bool.changed(() => {
    if (follow_mouse_bool.checked()) {
      user_selected = true;
    } else {
      user_selected = false;
    }
    
  });
  
  // Setup function dropdown
  function_select.option("x^2");
  function_select.option("2^x");
  function_select.option("e^x");
  function_select.option("1/x");
  function_select.option("sin(x)");
  function_select.option("cos(x)");
  function_select.option("tan(x)");
  function_select.option("sec(x)");
  function_select.option("csc(x)");
  function_select.option("cot(x)");
  function_select.option("Fourier Square Wave", fourier_square);
  function_select.option("Fourier Sawtooth Wave", fourier_saw);
  
  function_select.changed(() => {
    points = [];
    calculate_graph(function_select.value());
    graph_pos = 0;
  });
  
  calculate_graph(function_select.value());
}

function draw() {
  background(220);
  // Draw graph
  graph_func();
  image(fx, 0, 0);
  
  graph_dydx();
  image(dydx, buffer_width, 0);

  // Increment position on graph, used by tangent line
  graph_pos = !user_selected ? (graph_pos + 1) % points.length : graph_pos;

  // Move tangent line with mouse
  if (follow_mouse_bool.checked()) {
    graph_pos = parseInt(mouseX / fx.width * points.length) % points.length;
  }

  // Copy contents of graphics buffers onto canvas
}

function graph_func() {
  fx.background(220);

  // Axes
  fx.line(-width/2, 0, width/2, 0);    // X
  fx.line(0, -height/2, 0, height/2);  // Y
  
  // Unit marks
  for (var i = -graph_size/2; i < graph_size/2; i++) {
    fx.line(unit_size*i, -5, unit_size*i, 5);  // X
    fx.line(-5, unit_size*i, 5, unit_size*i);  // Y
  }
  
  // Curve
  for (var p = 0; p < points.length-1; p++) {
    fx.strokeWeight(3);
    fx.line(points[p][0].x * unit_size, -points[p][0].y * unit_size, points[p+1][0].x * unit_size, -points[p+1][0].y * unit_size);
    fx.strokeWeight(1);
  }
  
  // Tangent line
  fx.stroke(255, 0, 0);
  fx.strokeWeight(4);
  var x = points[graph_pos][0].x;
  var y = points[graph_pos][0].y;
  var m = points[graph_pos][1];
  var angle = atan2(m, 1);
  
  var scale = cos(angle);
  
  fx.circle(x*unit_size, -y*unit_size, 5);
  fx.line(x*unit_size-len_tan_line*unit_size*scale, -y*unit_size+m*scale*len_tan_line*unit_size, x*unit_size+len_tan_line*unit_size*scale, -y*unit_size-m*scale*len_tan_line*unit_size);
  fx.strokeWeight(1);
  fx.stroke(0);
  
  // Point/slope information
  fx.text("x = " + rnd(points[graph_pos][0].x), fx.width/4, fx.height/4);
  fx.text("y = " + rnd(points[graph_pos][0].y), fx.width/4, fx.height/4 + 15);
  fx.text("m = " + rnd(points[graph_pos][1]), fx.width/4, fx.height/4 + 30);
  
}

function graph_dydx() {
  dydx.background(0);
  
  // Axes
  dydx.stroke(220);
  dydx.line(-width/2, 0, width/2, 0);    // X
  dydx.line(0, -height/2, 0, height/2);  // Y
  
  // Unit marks
  for (var i = -graph_size/2; i < graph_size/2; i++) {
    dydx.line(unit_size*i, -5, unit_size*i, 5);  // X
    dydx.line(-5, unit_size*i, 5, unit_size*i);  // Y
  }
  
  // Curve
  for (var p = 0; p < points.length-1; p++) {
    dydx.strokeWeight(3);
    dydx.line(points[p][0].x * unit_size, -points[p][1] * unit_size, points[p+1][0].x * unit_size, -points[p+1][1] * unit_size);
    dydx.strokeWeight(1);
  }
  
  // Position marker
  dydx.stroke(255, 0, 0);
  dydx.strokeWeight(4);
  dydx.fill(255, 0, 0);
  dydx.circle(points[graph_pos][0].x * unit_size, -points[graph_pos][1] * unit_size, 5);
  dydx.strokeWeight(1)
  
  // Point info
  dydx.stroke(255);
  dydx.fill(255);
  dydx.text("x = " + rnd(points[graph_pos][0].x), -dydx.width/4-50, dydx.height/4+15);
  dydx.text("y = " + rnd(points[graph_pos][1]), -dydx.width/4-50, dydx.height/4+30);
  dydx.stroke(0);
  dydx.fill(0);
}

function calculate_graph(func) {
  for (var i = -graph_size/2-1; i < graph_size/2+1; i++) {
    for (var j = 0; j < curve_resolution; j++) {
      var k = i + j/curve_resolution;
      var scope = {
        x: k
      };
      // calculate point
      var p = createVector(k, math.evaluate(func, scope));
      
      // calculate slope at each point (numerical differentiation)
      scope.x += 0.00001;
      var d = derive(p.y, math.evaluate(func, scope));
      
      // push [point, dy/dx] pair to array
      points.push([p, d]);
    }
  }
}

function derive(y, dy) {
  // Alternate form of derivative
  return (dy - y) / 0.00001;
}

function rnd(x, places=3) {
  // rounds x to given number of decimal places
  return parseInt(x * pow(10, places)) / pow(10, places);
  
}
