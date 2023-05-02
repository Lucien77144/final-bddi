#include <fog_pars_vertex>

varying vec2 vUv;
uniform float uTime;  // temps depuis le début de la scène
uniform sampler2D tNoise;

void main() {
	vUv = uv;

	#include <begin_vertex>
	#include <project_vertex>
	#include <fog_vertex>
}
