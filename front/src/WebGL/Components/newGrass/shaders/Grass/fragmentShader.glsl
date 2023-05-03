uniform float uMaxBladeSize;
uniform vec3 uBaseColor;

varying vec3 vBasePosition;

void main() {
  gl_FragColor = vec4(mix(uBaseColor, vec3(.04, .56, .27), vBasePosition.y / uMaxBladeSize), 1.);
}