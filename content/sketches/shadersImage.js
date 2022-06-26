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
	normalMaskShader = readShader("/showcase/shaders/normalmask.frag", { varyings: Tree.texcoords2,});
    interestMaskShader = readShader("/showcase/shaders/interestmask.frag", { varyings: Tree.texcoords2,});
    magnifierMaskShader = readShader("/showcase/shaders/magnifiermask.frag", { varyings: Tree.texcoords2,});
  	img = loadImage("/showcase/sketches/lenna.png");
}

function setup() {
	// shaders require WEBGL mode to work
	createCanvas(650, 500, WEBGL);
	noStroke();
	textureMode(NORMAL);


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
				normalMaskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]);
                interestMaskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]); // Identity
				break;
			case '1':
				normalMaskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]);
                interestMaskShader.setUniform('mask', [0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625]); // Gaussian blur
				break;
			case '2':
				normalMaskShader.setUniform('mask', [0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111]);
                interestMaskShader.setUniform('mask', [0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111, 0.1111]); // Box blur
				break;
			case '3':
				normalMaskShader.setUniform('mask', [1.0, 0.0, 1.0, 0.0, -4.0, 0.0, 1.0, 0.0, 1.0]);
                interestMaskShader.setUniform('mask', [1.0, 0.0, 1.0, 0.0, -4.0, 0.0, 1.0, 0.0, 1.0]); // Laplacian 
				break;
			case '4':
				normalMaskShader.setUniform('mask', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]);
                interestMaskShader.setUniform('mask', [-1.0, -1.0, -1.0, -1.0, 8.0, -1.0, -1.0, -1.0, -1.0]); // Edge detect 
				break;
			case '5':
				normalMaskShader.setUniform('mask', [-2.0, -1.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 2.0]);
                interestMaskShader.setUniform('mask', [-2.0, -1.0, 0.0, -1.0, 1.0, 1.0, 0.0, 1.0, 2.0]); // Emboss
				break;
			case '6':
				normalMaskShader.setUniform('mask', [-1.0, 0.0, -1.0, 0.0, 5.0, 0.0, -1.0, 0.0, -1.0]);
                interestMaskShader.setUniform('mask', [-1.0, 0.0, -1.0, 0.0, 5.0, 0.0, -1.0, 0.0, -1.0]); // Sharpen
				break;
			case '7':
				normalMaskShader.setUniform('mask', [1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0]);
                interestMaskShader.setUniform('mask', [1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0]); // Sobel
				break;
			case '8':
				normalMaskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]);
                interestMaskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]);
				break;
			default:
				console.log(mask.value());
				break;
		}
	});
    region = createCheckbox('Region', false);
	region.style('color', 'white');
	region.changed(() => {
		if (region.checked()) {
			shader(interestMaskShader);
            interestMaskShader.setUniform('texture', img);
            interestMaskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]);
            emitTexOffset(interestMaskShader, img, 'texOffset');
            emitResolution(interestMaskShader, 'u_resolution');
		} else {
			shader(maskShader);
            normalMaskShader.setUniform('texture', img);
            normalMaskShader.setUniform('mask', [0.0, 0.0, 0.0, 0.0, 1., 0.0, 0.0, 0.0, 0.0]);
            emitTexOffset(normalMaskShader, img, 'texOffset');
            emitResolution(normalMaskShader, 'u_resolution');
		}
	});

}

function draw() {
	background(0);
	emitMousePosition(interestMaskShader, 'u_mouse');
	quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}