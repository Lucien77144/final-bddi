uniform float uTime;
uniform sampler2D uDisplacement;
uniform vec2 uSize;

varying vec3 vBasePosition;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

float wave(float waveSize, float tipDistance, float centerDistance) {
  // Tip is the fifth vertex drawn per blade
  bool isTip = (gl_VertexID + 1) % 5  == 0;

  float waveDistance = isTip ? tipDistance : centerDistance;
  return sin((uTime / 500.0) + waveSize) * waveDistance;
}

void main() {
  vPosition = position;
  vBasePosition = position;
  vUv = uv;

  vNormal = normalize(normalMatrix * normal);

  vPosition.x += wave(vUv.x * 10.0, 0.1, 0.04); 
  
  vec2 posScale = vec2(vPosition.x, -vPosition.z) / uSize.x + .5;
	vec4 displacement = texture2D(uDisplacement, posScale);
	vPosition.y += displacement.r;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}