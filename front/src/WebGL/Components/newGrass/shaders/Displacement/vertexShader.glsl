varying vec2 vUv;

uniform sampler2D uDisplacement;
uniform sampler2D positionTexture;

void main(){
	vUv = uv;
	vec4 displacement = texture2D(uDisplacement, vUv);
	float redFactor = displacement.r;
	vec3 newPosition = position + normal * redFactor;
	
	vec4 position = texture2D(positionTexture, uv);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}