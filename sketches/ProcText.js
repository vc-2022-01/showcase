let pg;
let truchetShader;
let maksk1, mask2;
let fig;
let disp;
let selectedShader;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('/showcase/sketches/shaders/truchet.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  bricksShader = readShader('/showcase/sketches/shaders/bricks.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  decoShader = readShader('/showcase/sketches/shaders/deco.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  linesShader = readShader('/showcase/sketches/shaders/lines.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  mirrorShader = readShader('/showcase/sketches/shaders/mirror.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  waveShader = readShader('/showcase/sketches/shaders/wave.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  zigzagShader = readShader('/showcase/sketches/shaders/zigzag.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  
  mask1 = createSelect();
	mask1.option('Plane', 0);
	mask1.option('Box', 1);
	mask1.option('Sphere', 2);
	mask1.option('Cylinder', 3);
	mask1.option('Cone', 4);
	mask1.option('Ellipsoid', 5);
	mask1.option('Torus', 6);
	mask1.position(10, 10);
  
   mask2 = createSelect();
	mask2.option('Truchet', 0);
	mask2.option('Bricks', 1);
	mask2.option('Deco', 2);
	mask2.option('Lines', 3);
	mask2.option('Mirror', 4);
	mask2.option('Wave', 5);
	mask2.option('Zigzag', 6);
	mask2.position(10, 40);
  
  
  pg.noStroke();
  pg.textureMode(NORMAL);
  // use truchetShader to render onto pg
  pg.shader(truchetShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(truchetShader);
  
  
  // https://p5js.org/reference/#/p5.Shader/setUniform
  truchetShader.setUniform('u_zoom', 3);
  bricksShader.setUniform('u_zoom', 3);
  decoShader.setUniform('u_zoom', 3);
  linesShader.setUniform('u_zoom', 3);
  mirrorShader.setUniform('u_zoom', 3);
  waveShader.setUniform('u_zoom', 3);
  zigzagShader.setUniform('u_zoom', 3);
  
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture
  texture(pg);
  fig = plane(100,200)
}

function draw() {
  background(33);
  orbitControl();  
  switch (mask1.value()) {
			case '0':
				fig = plane(100,200);
				break;
			case '1':
				fig = box(100)
				break;
			case '2':
			    fig = sphere(100)
				break;
			case '3':
				fig = cylinder(100,200)
				break;
			case '4':
				fig = cone(100,200) 
				break;
			case '5':
				 fig = ellipsoid(100,50) 
				break;
			case '6':
				fig = torus(100,50) 
				break;
			default:
				console.log(mask1.value());
				break;
		}
  
  mask2.changed(() => {
		switch (mask2.value()) {
			case '0':
				pg.shader(truchetShader)
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
				break;
			case '1':
                pg.shader(bricksShader);
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                pg.emitResolution(bricksShader);
				break;
			case '2':
			    pg.shader(decoShader);
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                pg.emitResolution(decoShader);
				break;
			case '3':
				pg.shader(linesShader);
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                pg.emitResolution(linesShader);
				break;
			case '4':
				pg.shader(mirrorShader);
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                pg.emitResolution(mirrorShader);
				break;
			case '5':
				pg.shader(waveShader);
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                pg.emitResolution(waveShader);
				break;
			case '6':
				pg.shader(zigzagShader);
                pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
                pg.emitResolution(zigzagShader);
				break; 
			default:
				console.log(mask1.value());
				break;
		}
  });
  
}

function maskChanged()
{
  
}
function mouseMoved() {
  switch (mask2.value()) {
			case '0':
				truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			case '1':
                bricksShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			case '2':
			   decoShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			case '3':
				linesShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			case '4':
				mirrorShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			case '5':
				waveShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			case '6':
				zigzagShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
				break;
			default:
				console.log(mask1.value());
				break;
		}
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}