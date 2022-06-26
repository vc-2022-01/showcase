let maskShader;
let img;
let video_src;
let region;
let mask;
/* 
	References:
	https://docs.isf.video/primer_chapter_6.html#what-is-a-convolution-matrix 
	https://programmathically.com/understanding-convolutional-filters-and-convolutional-kernels/ 
*/

function preload() {
	maskShader = readShader("/showcase/sketches/mask.frag", { varyings: Tree.texcoords2,});
  	img = loadImage("/showcase/tierra.png");
}

function setup() {
	// shaders require WEBGL mode to work
	createCanvas(650, 500, WEBGL);
	noStroke();
	textureMode(NORMAL);

	region = createCheckbox('Region', false);
	region.style('color', 'white');
	region.changed(() => {
		if (region.checked()) {
			maskShader.setUniform('region', true);
		} else {
			maskShader.setUniform('region', false);
		}
	});
	region.position(100, 10);
	mask = createSelect();
	mask.option('None', 0);
	mask.option('Gaussian', 1);
	mask.option('Box Blur', 2);
	mask.option('Laplacian', 3);
	mask.option('Edge', 4);
	mask.option('Emboss', 5);
	mask.option('Sharpen', 6);
	mask.option('Sobel', 7);
	mask.option('Magnifier', 8);
	mask.position(10, 10);
	mask.changed(() => {
		switch (mask.value()) {
			case '0':
				maskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]); // Identity
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '1':
				maskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]); // Gaussian blur
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '2':
				maskShader.setUniform('mask', [0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111]); // Box blur
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '3':
				maskShader.setUniform('mask', [1.0, 0.0, 1.0, 0.0, -4.0, 0.0, 1.0, 0.0, 1.0]); // Laplacian 
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '4':
				maskShader.setUniform('mask', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]); // Edge detect 
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '5':
				maskShader.setUniform('mask', [-2.0, -1.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 2.0]); // Emboss
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '6':
				maskShader.setUniform('mask', [-1.0, 0.0, -1.0, 0.0, 5.0, 0.0, -1.0, 0.0, -1.0]); // Sharpen
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '7':
				maskShader.setUniform('mask', [1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0]); // Sobel
				maskShader.setUniform('option', 0); // Magnifier
				break;
			case '8':
				maskShader.setUniform('option', 1); // Magnifier
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