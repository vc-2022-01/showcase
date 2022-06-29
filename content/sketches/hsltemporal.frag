precision mediump float;


uniform int selectedTool;
uniform int colorTexture;
uniform sampler2D texture;
uniform vec2 mousePos;


varying vec2 texcoords2;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 rgb2hsvMia(vec3 c) {
  vec3 outputColor = vec3(0.0);
  float minimo = min(c.r, c.g);
  minimo = min(minimo, c.b);

  float maximo = max(c.r, c.g);
  maximo = max(maximo, c.b);

  float diferencia = maximo - minimo;

  float multiplo = 0.6;
  float divisor = 3.6;

  if(diferencia == 0.0) {
    outputColor.x = 0.0;
  } else if(maximo == c.r) {
    float temp = (multiplo * ((c.g - c.b) / diferencia) + 3.6);
    float temp2 = (divisor * floor(temp / divisor));
    outputColor.x = temp - temp2;
  } else if(maximo == c.g) {
    float temp = (multiplo * ((c.b - c.r) / diferencia) + 1.2);
    float temp2 = (divisor * floor(temp / divisor));
    outputColor.x = temp - temp2;
  } else if(maximo == c.b) {
    float temp = (multiplo * ((c.r - c.g) / diferencia) + 2.4);
    float temp2 = (divisor * floor(temp / divisor));
    outputColor.x = temp - temp2;
  }

  if(maximo == 0.0) {
    outputColor.y = 0.0;
  } else {
    outputColor.y = (diferencia / maximo);
  }

  outputColor.z = maximo;
  return outputColor;
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2hsl(vec3 c) {
  vec3 outputColor = vec3(0.0);

  outputColor.x = c.x;

  outputColor.z = c.z * (1.0 - (c.y / 2.0));

  if(outputColor.z == 0.0 || outputColor.z == 1.0) {
    outputColor.y = 0.0;
  } else {
    outputColor.y = (c.x - outputColor.z) / min(outputColor.z, 1.0 - outputColor.z);
  }
  return outputColor;
}

void main() {
  vec4 texel = texture2D(texture, texcoords2);

  vec4 outputValue;

  if(selectedTool == 0) {
    outputValue = texel;
  } else if(selectedTool == 1) {
    vec3 hsv = rgb2hsv(texel.rgb);
    outputValue = vec4(hsv.rgb, 1.0);
  } else if(selectedTool == 2) {
    vec3 hsv = rgb2hsvMia(texel.rgb);
    outputValue = vec4(hsv.rgb, 1.0);
  } else if(selectedTool == 3) {
    vec3 hsv = rgb2hsv(texel.rgb);

    vec3 hsl = hsv2hsl(hsv);
    outputValue = vec4(hsl.rgb, 1.0);
  }

  if(colorTexture == 0) {
    outputValue.rgb = outputValue.rgb * 1.0;
  } else if(colorTexture == 1) {
    outputValue.rgb = outputValue.rgb * vec3(1.0, 0.0, 0.0);
  } else if(colorTexture == 2) {
    outputValue.rgb = outputValue.rgb * vec3(0.0, 1.0, 0.0);
  } else if(colorTexture == 3) {
    outputValue.rgb = outputValue.rgb * vec3(0.0, 0.0, 1.0);
  } else if(colorTexture == 4) {
    if(mousePos.x < 0.5) {
      outputValue.rgb = outputValue.rgb * vec3(mousePos.x, mousePos.y, 0.5 - mousePos.x);
    }else {
      outputValue.rgb = outputValue.rgb * vec3(1.0 - mousePos.x, mousePos.y, mousePos.x);
    }
  }

  gl_FragColor = outputValue;
}