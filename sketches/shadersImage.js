let maskShader;
let focustmaskShader;
let normalmaskShader;
let img;
let img1;
let img2;
let video_src;
let region;
let mask;
/* 
	References:
	https://docs.isf.video/primer_chapter_6.html#what-is-a-convolution-matrix 
	https://programmathically.com/understanding-convolutional-filters-and-convolutional-kernels/ 
*/

function preload() {
    
	//focustmaskShader = readShader("/showcase/sketches/focustmask.frag", { varyings: Tree.texcoords2,});
    //normalmaskShader = readShader("/showcase/sketches/normalmask.frag", { varyings: Tree.texcoords2,});
    maskShader = readShader("/showcase/sketches/mask.frag", { varyings: Tree.texcoords2,});
  	img1 = loadImage("/showcase/sketches/lenna.png");
    img2 = loadImage("/showcase/sketches/mandrill.png");
}

function setup() {
	// shaders require WEBGL mode to work
	createCanvas(650, 500, WEBGL);
	noStroke();
	textureMode(NORMAL);
    img = img1;
	foco = createCheckbox('foco', false);
	foco.style('color', 'blue');
	foco.changed(() => {
		if (foco.checked()) {
			maskShader.setUniform('foco',true)
		} else {
			maskShader.setUniform('foco',false)
		}
	});
	foco.position(100, 10);
    images = createSelect();
    images.option('imagen1',0);
    images.option('imagen2',1);
    images.option('imagen3',2);
        switch(images.value()){
            case '0':
                img = loadImage("/showcase/sketches/lenna.png");
                break;
            case '1':
                img = loadImage("/showcase/sketches/mandrill.png");
                break;
            case '2':
                break;
        }
	mask = createSelect();
	mask.option('None', 0);
	mask.option('Gaussian', 1);
	mask.option('Box Blur', 2);
	mask.option('Laplacian', 3);
	mask.option('Edge', 4);
	mask.option('Emboss', 5);
	mask.option('Sharpen', 6);
	mask.option('Sobel', 7);
	mask.position(10, 10);
	mask.changed(() => {
		switch (mask.value()) {
			case '0':
				maskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]); // Identity
				break;
			case '1':
				maskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]); // Gaussian blur
				break;
			case '2':
				maskShader.setUniform('mask', [0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111]); // Box blur
				break;
			case '3':
				maskShader.setUniform('mask', [1.0, 0.0, 1.0, 0.0, -4.0, 0.0, 1.0, 0.0, 1.0]); // Laplacian 
				break;
			case '4':
				maskShader.setUniform('mask', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]); // Edge detect 
				break;
			case '5':
				maskShader.setUniform('mask', [-2.0, -1.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 2.0]); // Emboss
				break;
			case '6':
				maskShader.setUniform('mask', [-1.0, 0.0, -1.0, 0.0, 5.0, 0.0, -1.0, 0.0, -1.0]); // Sharpen
				break;
			case '7':
				maskShader.setUniform('mask', [1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0]); // Sobel
				break;
			default:
				console.log(mask.value());
				break;
		}
	});
	shader(maskShader);
	maskShader.setUniform('texture', img);
	maskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]); // Identity
	emitTexOffset(maskShader, img, 'texOffset');
	emitResolution(maskShader, 'u_resolution');
}

function draw() {
	background(0);
	emitMousePosition(maskShader, 'u_mouse');
	quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}