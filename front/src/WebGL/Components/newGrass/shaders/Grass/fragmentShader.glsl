uniform float uMaxBladeSize;
uniform vec3 uBaseColor;

varying vec3 vBasePosition;
varying float vMask;

void main() {
  gl_FragColor = vec4(mix(uBaseColor, vec3(.04, .56, .27), vBasePosition.y / uMaxBladeSize), 1. * vMask);
}