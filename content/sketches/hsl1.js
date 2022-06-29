let Shader;
let fiesta;
let tortuga;
let hsvSelect;
let colorTexture;
let imageSelect;
let mousePos;

function preload() {
  Shader = readShader("/showcase/sketches/hsl.frag", { varyings: Tree.texcoords2 }
  );
  fiesta = loadImage("/showcase/sketches/pexels-md-noor-hossain-8443591.jpg");
}



function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(Shader);

  colorTexture = createSelect();
  colorTexture.position(10, 10);
  colorTexture.option("Original", 0);
  colorTexture.option("red", 1);
  colorTexture.option("green", 2);
  colorTexture.option("blue", 3);
  colorTexture.changed(() => {
    Shader.setUniform("colorTexture", colorTexture.value());
  });

  Shader.setUniform("texture", fiesta);


}

function draw() {
  Shader.setUniform("mousePos", [map(mouseX, 0, width, 0.0, 1.0), map(mouseY, 0, width, 0.0, 1.0)]);
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2 );
}