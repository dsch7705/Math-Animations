function limacon(a, b, theta) {
  return a + -b * sin(theta);
}

function lemniscate(a, theta) {
  return -sqrt(a * a * sin(2 * theta));
}

function rose(a, b, theta) {
  return -a * sin(b * theta);
}

function spiral(a, theta) {
  return -a * theta;
}
