#include <fog_pars_vertex>

varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform sampler2D tNoise;
varying vec3 vReflect;
uniform samplerCube envMap;

void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 normal = normalize(normalMatrix * normal);
    vec4 myMvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewDir = normalize(-myMvPosition.xyz);
    vReflect = reflect(viewDir, normal);

    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>
}
