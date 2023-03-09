uniform float uTime;
uniform float uSecondarySpread;
uniform bool uDarkSpread;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

vec3 green = vec3(0.2, 0.6, 0.3);
vec3 orange = vec3(0.8, 0.4, 0.1);

void main() {
  vec3 color = mix(green * 0.8, green, fract(sin(dot(vec3(uTime, 0.0, 0.0), vec3(12.9898, 78.233, 98.422)) * 43758.5453)));

  color = mix(color, vec3(0, 0, 0), 0.4);
  color = mix(color, mix(orange, color, (vPosition.x + vPosition.z) / 2.), vPosition.y * uSecondarySpread);

  float lighting = normalize(dot(vNormal, vec3(10)));
  gl_FragColor = vec4(color + lighting * 0.03, 1.0);
}