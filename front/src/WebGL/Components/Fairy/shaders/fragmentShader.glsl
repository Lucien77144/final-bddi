uniform float uTime;
uniform float uFadeIn;
uniform float uDelay;
uniform float uFadeOut;
varying float vLife;

uniform vec3 uColor;

void main()
{
    float life = 1. - min((uTime - vLife) / 1000., 1.);

    float fadeIn = clamp(life / uFadeIn, 0.0, 1.0);
    float fadeOut = clamp((1.0 - life) / uFadeOut, 0.0, 1.0);

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = .05 / distanceToCenter - .1;

    strength *= min(fadeIn, fadeOut);

    gl_FragColor = vec4(uColor, strength / 1.2);
}