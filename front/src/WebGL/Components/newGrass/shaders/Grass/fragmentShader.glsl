uniform float uTime;
uniform float uMaxBladeSize;
uniform vec3 uBaseColor;

varying vec3 vBasePosition;

float rdm() {
  return fract(sin(dot(vec3(uTime, 0.0, 0.0), vec3(12.9898, 78.233, 98.422)) * 43758.5453));
}

void main() {
  gl_FragColor = vec4(mix(uBaseColor, vec3(.04, .56, .27), vBasePosition.y / uMaxBladeSize), 1.);
}