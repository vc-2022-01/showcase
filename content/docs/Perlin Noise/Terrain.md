# Terreno procedural

```html
{{</* let terrain = [];
function setup() {
  createCanvas(500, 500, WEBGL);
  cols = 0;rows = 0;
  elevacion = 100;
  scl = 25;
  vel = 0.05;
  cambio = scl;
  crecimiento = 0.07;
  w = 800;
  h = 800;
  cols = w/scl;
  rows = h/scl;
  avance = 0;
 
}


function stripOfTerrain(){
  yoff = avance;
  xoff = 0;
  for(x = 0; x < (cols);x++){
    terrain[x] = [];
  }
  for(y = 0; y < (rows); y++){
      xoff = 0;
    for(x = 0; x < (cols);x++){
      terrain[x][y] = map(noise(xoff,yoff),0,1,-elevacion,elevacion);
        xoff += crecimiento;
      }
      yoff += crecimiento;
    }
}

function draw() {
  stripOfTerrain();
  cols = w/scl;
  rows = h/scl;
  avance -= vel;
  background('blue');
  stroke(255);
  rotateX(PI/3);
  translate(-375,-525);
  for(y = 0; y < rows; y++){
      beginShape(TRIANGLE_STRIP);
      for(x = 0; x < cols;x++){
        fill(10,200,200-terrain[x][y]*10)
        vertex(x*scl,y*scl,terrain[x][y]);
        fill(10,255,100-terrain[x][y+1]*10)
        vertex(x*scl,(y+1)*scl,terrain[x][y+1]);
      }
      endShape();
    }
} */>}}
```

All parameters are optional but `sketch`. Default values are shown in the above snippet but for `libs*`. Up to `lib5` libs may be specified.







{{< p5-iframe sketch="/showcase/sketches/terreno.js" width="425" height="425" >}}


