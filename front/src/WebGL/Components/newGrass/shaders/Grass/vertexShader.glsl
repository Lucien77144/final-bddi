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

  vNormal = normalize(normalMatrix * normal);
  vec2 posScale = vec2(vBasePosition.x, -vBasePosition.z) / uSize.x + .5;
	vec4 displacement = texture2D(uDisplacement, posScale);
  
  vPosition.x += wave(1., .1, .04);
	vPosition.y += displacement.r * uSize.y;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.);
}