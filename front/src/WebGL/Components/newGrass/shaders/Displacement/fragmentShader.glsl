varying vec2 vUv;

uniform sampler2D uDisplacement;

void main() {
	vec4 displacement = texture2D(uDisplacement, vUv);
	float redFactor = displacement.r;

  gl_FragColor = vec4(.0, 1.*redFactor, 1., 1.0);
}