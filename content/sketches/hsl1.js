let Shader;
let fiesta;
let tortuga;
let hsvSelect;
let colorTexture;
let imageSelect;
let mousePos;

function preload() {
  Shader = readShader("/showcase/sketches/entrega3/cbt/color_tools/hsv.frag", { varyings: Tree.texcoords2 }
  );
  fiesta = loadImage(
    "/showcase/sketches/pexels-md-noor-hossain-8443591.jpg"
  );
  tortuga = loadImage(
    "/showcase/sketches/pexels-belle-co-847393.jpg"
  );
}



function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(Shader);

  colorTexture = createSelect();
  colorTexture.position(130, 10);
  colorTexture.option("none", 0);
  colorTexture.option("red", 1);
  colorTexture.option("green", 2);
  colorTexture.option("blue", 3);
  colorTexture.option("mouse", 4);
  colorTexture.changed(() => {
    Shader.setUniform("colorTexture", colorTexture.value());
  });

  hsvSelect = createSelect();
  hsvSelect.position(10, 10);
  hsvSelect.option("none", 0);
  hsvSelect.option("hsv-external", 1);
  hsvSelect.option("hsv-propia", 2);
  hsvSelect.option("hsl", 3);
  hsvSelect.selected("none");
  hsvSelect.changed(() => {
    Shader.setUniform("selectedTool", hsvSelect.value());
  });

  Shader.setUniform("texture", fiesta);

  imageSelect = createSelect();
  imageSelect.position(210, 10);
  imageSelect.option("imagen 1", 0);
  imageSelect.option("imagen 2", 1);
  imageSelect.changed(() => {
    if (imageSelect.value() == 0) {
      Shader.setUniform("texture", fiesta);
    } else {
      Shader.setUniform("texture", tortuga);
    }
  });
}

function draw() {
  Shader.setUniform("mousePos", [map(mouseX, 0, width, 0.0, 1.0), map(mouseY, 0, width, 0.0, 1.0)]);
  background(0);
  quad(-width / 2, -height / 2,
    width / 2, -height / 2,
    width / 2,
    height / 2, -width / 2,
    height / 2
  );
}