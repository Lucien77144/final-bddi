varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform float uFadeIn;
uniform float uFadeOut;
uniform float uFairyDistance;

void main()
{
    float life = mod(uTime * .85 + (vUv.x + vUv.y) * 2000., 2000.); // vie qui va de 0 à 1000

    float fadeInTime = 200.0;
    float fadeOutTime = 800.0;
    float minSize = 0.001;
    float maxSize = 0.07;
    float size;

    float minLife = 1400.;

    if (life < fadeInTime) {
        // Interpolation de la taille minimale à la taille maximale pendant la période de fade-in
        size = mix(minSize, maxSize, smoothstep(0.0, fadeInTime, life));
    } else if (life > fadeOutTime) {
        // Interpolation de la taille maximale à la taille minimale pendant la période de fade-out
        size = mix(maxSize, minSize, smoothstep(fadeOutTime, 1400.0, life));
    } else {
        // Taille maximale pendant la période stable
        size = maxSize;
    }

    // if(uFairyDistance < .5){
	//     size = minSize;
	// }

    if(uFairyDistance < .5 && life >= minLife){
        size = minSize;
    }

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = size / distanceToCenter - 0.1;

    gl_FragColor = vec4(uColor, strength );
}
