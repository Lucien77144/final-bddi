uniform float uTime;
uniform float uColorScale;
uniform float uMaxBladeSize;

varying vec3 vPosition;
varying vec3 vBasePosition;
varying float vWind;
varying vec3 vNormal;

uniform vec3 uBaseColor;

float rdm() {
  return fract(sin(dot(vec3(uTime, 0.0, 0.0), vec3(12.9898, 78.233, 98.422)) * 43758.5453));
}

void main() {
  float lighting = normalize(dot(vNormal, vec3(10)));

  gl_FragColor = vec4(mix(uBaseColor, vec3(.04, .56, .27), vBasePosition.y / uMaxBladeSize), 1.);
}