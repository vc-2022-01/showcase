#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D texture;
uniform vec2 texOffset;
// holds the 3x3 kernel
uniform float mask[9];
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform int option;
uniform bool region;

// we need our interpolated tex coord
varying vec2 texcoords2;

void main() {
    vec2 xy = gl_FragCoord.xy - u_mouse.xy;
    float R = 100.;
    float h = 40.;
    float hr = R * sqrt(1. - ((R - h) / R) * ((R - h) / R));
    float r = sqrt((xy.x * xy.x) + (xy.y * xy.y));
    vec2 new_xy = r < hr ? xy * (R - h) / sqrt(R * R + r * r) : xy;
    gl_FragColor = texture2D(texture, (new_xy.xy + u_mouse.xy) / u_resolution.xy);
}