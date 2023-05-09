varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform float uFadeIn;
uniform float uFadeOut;
uniform bool isFairyMoving;

void main()
{
    float life = mod(uTime + vUv.x * 2000. + vUv.y * 2000., 2000.0); 

    float fadeInTime = 400.0;
    float fadeOutTime = 500.0;
    float minSize = 0.001;
    float maxSize = 0.07;
    float size;

    if (isFairyMoving) {
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
    } else {
        // Interpolation de la taille maximale à 0 pendant la période de fade-out si isFairyMoving est false
    //    size += 1.01;
    }

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = size / distanceToCenter;

    gl_FragColor = vec4(uColor, strength);
}
