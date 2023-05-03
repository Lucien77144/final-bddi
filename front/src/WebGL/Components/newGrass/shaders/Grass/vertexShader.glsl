uniform float uTime;
uniform sampler2D uDisplacement;
uniform vec3 uSize;

varying vec3 vBasePosition;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

float wave(float tipDistance) {
  // Tip is the fifth vertex drawn per blade
  bool isTip = (gl_VertexID + 1) % 5  == 0;

  float waveDistance = isTip ? tipDistance : 0.;
  return sin(vPosition.z + uTime / 1500.) * waveDistance;
}

void main() {
  vPosition = position;
  vBasePosition = position;
  vUv = uv;
  
  vNormal = normalize(normalMatrix * normal);

  vec2 posScale = vec2(vBasePosition.x / uSize.x, -vBasePosition.z / uSize.z) + .5;
	vec4 displacement = texture2D(uDisplacement, posScale);

  float windFactor = cos(uTime / 1500. + (vPosition.x + vPosition.z * 2.) / 3.) + sin(uTime / 1500. + (vPosition.x + vPosition.z * 2.) / 3.);
  float wind = -(windFactor + 1.) / 20.;

  vPosition.y += displacement.r * uSize.y + wind;
  vBasePosition.y += wind;

  vPosition.z += wave(wind);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.);
}