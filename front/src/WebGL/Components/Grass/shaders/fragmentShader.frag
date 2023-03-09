uniform float uTime;
uniform float uColorScale;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;

vec3 shadowSource(vec3 color) {
  return mix(color, vec3(0, 0, 0), -vPosition.y * 0.5);
}

vec3 getColor(float random) {
  if (random < .33 ) {
    return uColor1;
  } else if (random > .33 && random < .66) {
    return uColor2;
  } else {
    return uColor3;
  }
}

void main() {
  float random = fract(sin(dot(vec3(uTime, 0.0, 0.0), vec3(12.9898, 78.233, 98.422)) * 43758.5453));

  vec3 primaryColor = getColor(uColorScale);
  vec3 secondaryColor = getColor(uColorScale);

  vec3 color = mix(primaryColor * 0.8, primaryColor, random);
  color = mix(color, mix(secondaryColor, color, (vPosition.x + vPosition.z) / 2.), vPosition.y * uColorScale);
  color = mix(color, uColorScale > .5 ? uColor4 : uColor5, vPosition.y * 0.5);
  color = shadowSource(color);

  float lighting = normalize(dot(vNormal, vec3(10)));
  gl_FragColor = vec4(color + lighting * 0.03, 1.0);
}