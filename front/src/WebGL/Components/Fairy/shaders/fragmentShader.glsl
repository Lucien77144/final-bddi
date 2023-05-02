uniform float uTime;
uniform float uFadeIn;
uniform float uDelay;
uniform float uFadeOut;
varying float vLife;

uniform vec3 uColor;

void main()
{
    float fadeLife = (uTime - vLife) / 2000.;
    float lifeIn = 1. - min(fadeLife / uFadeIn, 1.);
    float lifeOut = 1. - min(fadeLife, 1.);

    float fadeIn = 1. - clamp(lifeIn, 0.0, 1.0) / uFadeIn;
    float fadeOut = clamp(lifeOut / uFadeOut, 0.0, 1.0);

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5)) * 2.;
    float strength = .1 / distanceToCenter;

    strength *= min(fadeOut, fadeIn) * min(fadeLife * 2., 1.) / 1.2;
    strength *= (uTime - vLife) / 1000.;

    gl_FragColor = vec4(uColor, strength);
}