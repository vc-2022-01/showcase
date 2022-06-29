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
    tortuga = loadImage("/showcase/sketches/pexels-belle-co-847393.jpg");
  }
  
  
function setup() {
    createCanvas(700, 500, WEBGL);
    noStroke();
    textureMode(NORMAL);
    shader(Shader);
  
    hsvSelect = createSelect();
    hsvSelect.position(10, 10);
    hsvSelect.option("Original", 0);
    hsvSelect.option("hsv-external", 1);
    hsvSelect.option("hsv-propia", 2);
    hsvSelect.option("hsl", 3);
    hsvSelect.selected("none");
    hsvSelect.changed(() => {
      Shader.setUniform("selectedTool", hsvSelect.value());
    });
    Shader.setUniform("selectedTool", hsvSelect.value());

  }
  
  function draw() {
    Shader.setUniform("mousePos", [map(mouseX, 0, width, 0.0, 1.0), map(mouseY, 0, width, 0.0, 1.0)]);
    background(0);
    quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2 );
  }