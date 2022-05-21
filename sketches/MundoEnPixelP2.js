let z;
let size;
let rotation;
let slider;
let sliderD;

function setup() {
  createCanvas(400, 400,WEBGL);
  sliderZ = createSlider(-100,0, 0);
  sliderZ.position(10, 10);
  sliderR = createSlider(0,1.55,0,0.05);
  sliderR.position(10, 350);
  size = 400;
  z = 0;
  rotation = 0;
  img = loadImage('.../tierra.jpg');
}

function draw() {
  
  background(220);
  rotateY(rotation)
  push();
  noStroke();
  translate(0,0,z)
  texture(img)
  plane(size);
  pop();
  
  push();
  noFill();
  cont = 0;
  for(x=0;x<10;x++){
    for(y = 0;y<10;y++){
      square((40*x)-200,(40*y)-200,40);
    }
  }
  pop();
  
}