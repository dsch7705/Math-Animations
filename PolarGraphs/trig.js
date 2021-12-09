function limacon(a, b, theta) {
  result = a + b * sin(theta;
  return result;
}

function lemniscate(a, theta) {
  result = sqrt(a * a * sin(2 * theta));
  if (isNaN(result)) {
    return 0
  }
  return result;
}

function rose(a, b, theta) {
  result = a * sin(b * theta);
  return result;
}

function spiral(a, theta) {
  result = a * theta;
  return result;
}
