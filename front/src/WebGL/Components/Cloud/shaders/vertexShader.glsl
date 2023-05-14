varying vec2 vUv;

uniform float uTime;
uniform sampler2D uMountain;
uniform sampler2D uMountainS;

void main(){
	vUv = uv;
	vec3 vPosition = position;

	vPosition.z = (1. - vUv.y);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}