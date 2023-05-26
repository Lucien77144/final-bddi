#include <common>
#include <packing>
#include <fog_pars_fragment>

varying vec2 vUv;
uniform sampler2D tNoise;
uniform sampler2D tDudv;
uniform vec3 topDarkColor;
uniform vec3 bottomDarkColor;
uniform vec3 topLightColor;
uniform vec3 bottomLightColor;
uniform vec3 foamColor;
uniform float uTime;

varying vec3 vReflect;
varying vec3 vPosition;
uniform samplerCube uEnvMap;
uniform vec2 uSize;

float fRound( float a ) {
    return floor( a + 0.5 );
}

const float strength = 0.02;
const float foamThreshold = 0.02;

void main() {
    vec3 reflectedColor = textureCube(uEnvMap, vec3(-vReflect.x, vReflect.yz)).rgb;
    vec2 displacement = texture2D( tDudv, vUv + uTime * 0.01 ).rg;
    displacement = ( ( displacement * 2.0 ) - 1.0 ) * strength;

    float noise = texture2D( tNoise, vec2( vUv.x, ( vUv.y / 5.0 ) + uTime * 0.1 ) + displacement ).r;
    noise = fRound( noise * 5.0 ) / 5.0; // banding, values in the range [0, 0.2, 0.4, 0.6, 0.8, 1]
    noise = mix(noise, step(0.3, noise), 0.6);

    vec3 color = mix( mix( bottomDarkColor, topDarkColor, vUv.y ), mix( bottomLightColor, topLightColor, vUv.y ), noise );
    color = mix( color, foamColor, step( vUv.y + displacement.y, foamThreshold ) ); // add foam
    
	float distX = clamp(1. - (vPosition.y - 10.) / uSize.x, 0., 1.);

    gl_FragColor.rgb = mix(color, reflectedColor, 0.15);
    gl_FragColor.a = 0.75 * distX;

    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
}