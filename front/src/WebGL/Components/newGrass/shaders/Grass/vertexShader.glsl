uniform float uTime;
uniform sampler2D uDisplacement;
uniform vec3 uSize;

varying vec3 vBasePosition;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

float wave(float waveSize, float tipDistance, float centerDistance) {
  // Tip is the fifth vertex drawn per blade
  bool isTip = (gl_VertexID + 1) % 5  == 0;

  float waveDistance = isTip ? tipDistance : centerDistance;
  return sin((vPosition.x + uTime) / 1000. + waveSize) * waveDistance;
}

void main() {
  vPosition = position;
  vBasePosition = position;
  vUv = uv;
  
  float random = fract(sin(dot(vec3(uTime, 0.0, 0.0), vec3(12.9898, 78.233, 98.422)) * 43758.5453));

  vNormal = normalize(normalMatrix * normal);
  vec2 posScale = vec2(vBasePosition.x / uSize.x, -vBasePosition.z / uSize.z) + .5;
	vec4 displacement = texture2D(uDisplacement, posScale);

	vPosition.y += displacement.r * uSize.y;

  float windFactor = cos(uTime / 2500. + (vPosition.x + vPosition.z * 2.) / 6.) + sin(uTime / 2500. + (vPosition.x + vPosition.z * 2.) / 6.);
  float wind = -abs(windFactor) / 10.;
  vPosition.y += wind;
  vBasePosition.y += wind;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.);
}