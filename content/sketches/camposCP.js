function Particle(){
  
  this.pos = createVector(random(width),random(height));
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxspeed = 2.5;
  
  this.update = function(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.applyForce = function(force){
    this.acc.add(force);
  }

  this.show = function(color1,color2,color3){
    stroke(0);
    stroke(color1,color2,color3);
    point(this.pos.x,this.pos.y);
  }
  
  this.edges = function(){
    if(this.pos.x > width){
      this.pos.x = 0;
    }
    if(this.pos.x < 0){
      this.pos.x = width;
    }
    if(this.pos.y > height){
      this.pos.y = 0;
    }
    if(this.pos.y < 0){
      this.pos.y = height;
    }
  }
  
  this.follow = function(vectors){
    x = floor(this.pos.x/scl);
    y = floor(this.pos.y/scl);
    index = x+y*cols;
    force = vectors[index];
    this.applyForce(force);
  }

}

scl = 10;
inc = 0.05;
incz = 0.00005;
a = 0;
var particles = [];
var flowfield;
function setup() {
  createCanvas(400, 400);
  background(220);
  cols = floor(width/scl);
  rows = floor(height/scl); 
  xoff = 0;
  yoff = 0;
  zoff = 0;

  flowfield = new Array(cols*rows);
  /*
  for(i=0;i<400;i++){
    particles[i] = new Particle();
  }*/
}

function draw() {

  background(220);
  yoff = 0;
  
  for(y =0;y<rows;y++){
    xoff = 0;
    for(x =0;x< cols;x++){
      index = x + y * cols;
      angle = noise(xoff,yoff,zoff)*TWO_PI*4;
      v = p5.Vector.fromAngle(angle);
      v.setMag(2);
      flowfield[index] = v;
      xoff += inc;
      stroke(0);
      push();
        translate(x*scl,y*scl);
        rotate(v.heading());
        line(0,0,scl,0);
      pop();
      
    }
    yoff += inc;
    //zoff += incz;
  }
  /*
  coloroff1 = 0.2;
  coloroff2 = 0.01;
  coloroff3 = 0.5;
  for(i = 0; i<particles.length;i++){
    color1 = (noise(coloroff1)*1000)%255;
    color2 = (noise(coloroff2)*1000)%255;
    color3 = (noise(coloroff3)*1000)%255;
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].show(color1,0,color3);
    particles[i].edges();
    coloroff3 += 0.01;
  }
  */
}