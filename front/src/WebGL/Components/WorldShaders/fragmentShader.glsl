uniform sampler2D tDiffuse;
uniform float vignette;
uniform float exposure;
uniform vec3 color;
varying vec2 vUv;

void main() {
	vec4 texel = texture2D( tDiffuse, vUv );
	vec2 p = vUv * 2.0 - 1.0;

	gl_FragColor = texel;
	gl_FragColor.xyz *= clamp(1.0 - length(p) * vignette, 0.0, 1.0 );
}