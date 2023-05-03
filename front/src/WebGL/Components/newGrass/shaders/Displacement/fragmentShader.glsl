uniform vec3 uBaseColor;

varying vec2 vUv;

void main() {
	gl_FragColor = vec4(uBaseColor, 1.);
}