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
uniform float radio;

// we need our interpolated tex coord
varying vec2 texcoords2;
float depth= radio/2.;

// === main loop ===
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = gl_FragColor.xy/u_resolution.xy;
	vec2 center = u_mouse.xy/u_resolution.xy;
	float ax = ((uv.x - center.x) * (uv.x - center.x)) / (0.2*0.2) + ((uv.y - center.y) * (uv.y - center.y)) / (0.2/ (  u_resolution.x / u_resolution.y )) ;
	float dx = 0.0 + (-depth/radio)*ax + (depth/(radio*radio))*ax*ax;
    float f =  (ax + dx );
	if (ax > radio) f = ax;
    vec2 magnifierArea = center + (uv-center)*f/ax;
    gl_FragColor = vec4(texture( texcoords2, vec2(1,-1) * magnifierArea ).rgb, 1.);  
}
