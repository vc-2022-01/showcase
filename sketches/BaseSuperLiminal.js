let fbo1, fbo2;
let cam1, cam2;
let target = 300;
let length = 1200;
let platesize = 200;
let boxes;
let box_key;
let fovy;
const SPEED = 5;

function setup() {
  createCanvas(length, length / 2);
  // frame buffer object instances (FBOs)
  fbo1 = createGraphics(width / 2, height, WEBGL);
  fbo2 = createGraphics(width / 2, height, WEBGL);
  // FBOs cams
  cam1 = new Dw.EasyCam(fbo1._renderer, { distance: 200 });
  let state1 = cam1.getState();
  cam1.attachMouseListeners(this._renderer);
  cam1.state_reset = state1;   // state to use on reset (double-click/tap)
  cam1.setViewport([0, 0, width / 2, height]);
  cam2 = new Dw.EasyCam(fbo2._renderer, { rotation: [0.94, 0.33, 0, 0] });
  cam2.attachMouseListeners(this._renderer);
  let state2 = cam2.getState();
  cam2.state_reset = state2;   // state to use on reset (double-click/tap)
  cam2.setViewport([width / 2, 0, width / 2, height]);
  document.oncontextmenu = function () { return false; }
  // scene
  colorMode(RGB, 1);
  let trange = 100;
  boxes = [];
    boxes.push(
      {
        position: createVector(100,0,-200),
        size: 15,
        boxtale: 10,
        color: color(random(), random(), random())
      }
      
    );
  fovy = createSlider(PI / 12, PI * (11 / 12), PI / 3, PI / 48);
  fovy.position(10, 10);
  fovy.style('width', '80px');
}

function draw() {
  fbo1.background(200, 125, 115);
  fbo1.reset();
  fbo1.perspective(fovy.value());
  fbo1.axes();
  //fbo1.grid();
  poioto();
  scene1();
  beginHUD();
  image(fbo1, 0, 0);
  endHUD();
  fbo2.background(130);
  fbo2.reset();
  fbo2.axes();
  //fbo2.grid();
  scene2();
  fbo2.viewFrustum(fbo1);
  beginHUD();
  image(fbo2, width / 2, 0);
  endHUD();
}

function poioto(){

}

function scene1() {
  
  boxes.forEach(box => {
    fbo1.push();
    //fbo1.fill(boxes[box_key] === box ? color('red') : box.color);
    fbo1.noFill('red');
    fbo1.translate(box.position);
    //fbo1.noStroke();
   
    if (boxes[box_key] === box) {
      if (keyIsPressed && !mouseIsPressed) {
        let boxLocation = fbo1.treeLocation([0, 0, 0], { from: fbo1.mMatrix(), to: 'WORLD' });
        let pixelRatio = fbo1.pixelRatio(boxLocation);
        box.target ??= box.size / pixelRatio;
        box.size = box.target * pixelRatio;
        let eyeLocation = fbo1.treeLocation([0, 0, 0], { from: 'EYE', to: 'WORLD' });
        box.position.add(p5.Vector.sub(boxLocation, eyeLocation).normalize().mult(key === 'w' ? SPEED : -SPEED));
      }
      else {
        box.target = undefined;
      }
    }
    fbo1.textSize(500);
    fbo1.text('word', 0, 0);
    fbo1.sphere(box.size);
    //fbo1.sphere(box.size,box.tale,(floor(box.position)%10)+10);
    fbo1.pop();
  }
  );
  fbo1.push();
    
    fbo1.translate(0,0,200)
    fbo1.sphere(20);
    fbo1.push();
    fbo1.translate(25,0,0);
    fbo1.rotateZ(-1.5);
    fbo1.cone(10,40);
    fbo1.pop();
    fbo1.push();
    fbo1.translate(-20,40,0);
    fbo1.sphere(30);
    fbo1.pop();
  fbo1.pop();
}

function scene2() {
  boxes.forEach(box => {
    fbo2.push();
    fbo2.noFill();
    //fbo2.fill(boxes[box_key] === box ? color('red') : box.color);
    fbo2.translate(box.position);
    //fbo2.noStroke();
    fbo2.sphere(box.size);
    fbo2.pop();
  }
  );

  fbo2.push();
  fbo2.translate(0,0,200)
  fbo2.sphere(20);
  fbo2.push();
  fbo2.translate(25,0,0);
  fbo2.rotateZ(-1.5);
  fbo2.cone(10,40);
  fbo2.pop();
  fbo2.push();
  fbo2.translate(-20,40,0);
  fbo2.sphere(30);
  fbo2.pop();
  fbo2.pop();
}

function keyPressed() {
  // press [0..9] keys to pick a box and other keys
  // to unpick, excepting 'w' and 'z' which are used
  // to move the box away or closer to eye.
  if (key !== 'w' && key !== 's') {
    box_key = parseInt(key);
  }
}