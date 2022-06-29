precision mediump float;

varying vec2 texcoords2;

void main() {

  gl_FragColor = vec4(texcoords2.xy, 1.0, 1.0);
}