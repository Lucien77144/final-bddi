varying vec2 vUv;

uniform sampler2D uDisplacement;

void main(){
	vUv = uv;
	vec4 displacement = texture2D(uDisplacement, uv);
	float redFactor = displacement.r;
	vec3 newPosition = position + normal * redFactor;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}