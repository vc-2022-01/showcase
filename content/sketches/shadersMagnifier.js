let maskShader;
let focustmaskShader;
let normalmaskShader;
let img;
let img1;
let img2;
let video_src;
let region;
let mask;
let radio;
/* 
	References:
	https://docs.isf.video/primer_chapter_6.html#what-is-a-convolution-matrix 
	https://programmathically.com/understanding-convolutional-filters-and-convolutional-kernels/ 
*/

function preload() {
    
	//focustmaskShader = readShader("/showcase/sketches/focustmask.frag", { varyings: Tree.texcoords2,});
    //normalmaskShader = readShader("/showcase/sketches/normalmask.frag", { varyings: Tree.texcoords2,});
    maskShader = readShader("/showcase/sketches/magnifiermask.frag", { varyings: Tree.texcoords2,});
    img = loadImage("/showcase/sketches/lenna.png");
  	img1 = loadImage("/showcase/sketches/lenna.png");
    img2 = loadImage("/showcase/sketches/mandrill.png");
}

function setup() {
	// shaders require WEBGL mode to work
	createCanvas(650, 500, WEBGL);
	noStroke();
	textureMode(NORMAL);
    radio = createSlider(100, 400, 50.0);
    radio.position(100, 10);
	rotation = createSlider(0.1, 2.0, 0.1);
    rotation.position(100, 25);
    //matrices de convolucion
	shader(maskShader);
    maskShader.setUniform('texture', img);
	maskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]); // Identity
	emitResolution(maskShader, 'u_resolution');
}

function draw() {
	background(0);
    maskShader.setUniform('radio',radio.value());
	emitMousePosition(maskShader, 'u_mouse');
	push();
	rotate(2*PI);
	quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
    pop();
}