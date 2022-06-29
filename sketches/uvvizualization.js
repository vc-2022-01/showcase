let uvShader;

function preload() {

  uvShader = readShader('/shaders/uv.frag', { matrices: Tree.NONE, varyings: Tree.texcoords2 });
}
//C:\Users\Home\Desktop\showcase\showcase\content\sketches\shaders\uv.frag
function setup() {
  // shaders require WEBGL mode to work
  createCanvas(600, 600, WEBGL);
  noStroke();
  shader(uvShader);
  textureMode(NORMAL);
}

function draw() {
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}