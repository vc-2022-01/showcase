let cx;
let cy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(20);
  calcCenter();
}

function calcCenter() {
  cx = windowWidth / 2;
  cy = windowHeight / 2;
}

function draw() {
  clear();
  strokeWeight(3);
  let a = frameCount/300;
  let x1 = cx; 
  let y1 = cy;
  let x2 = noise(a + 30000) * windowWidth;
  let y2 = noise(a + 40000) * windowHeight;
  line(x1, y1, x2, y2);
  
  let dx = x2 - x1;
  let dy = y2 - y1;
  let len = Math.sqrt(dx*dx + dy*dy);
  let slope = dy/dx;
  let angle = Math.atan2(dy, dx);
  let arrowAngle = 2.7;
  let arrowLength = len * 0.1;
  let x3 = x2 + Math.cos(angle + arrowAngle) * arrowLength;
  let y3 = y2 + Math.sin(angle + arrowAngle) * arrowLength;
  line(x2, y2, x3, y3);
  let x4 = x2 + Math.cos(angle - arrowAngle) * arrowLength;
  let y4 = y2 + Math.sin(angle - arrowAngle) * arrowLength;
  line(x2, y2, x4, y4);
  
  strokeWeight(1);
  text(`Angle: ${Math.round(angle * 180 / Math.PI + 180)} degrees`, 10, 30);
  text(`Length: ${Math.round(len)}`, 10, 50);
  text(`x, y: ${Math.round(x2-cx)}, ${Math.round(-y2+cy)}`, 10, 70);
}

function windowResized() {
  calcCenter();
  resizeCanvas(windowWidth, windowHeight);
}