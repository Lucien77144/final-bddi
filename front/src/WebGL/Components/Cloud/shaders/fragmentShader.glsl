varying vec2 vUv;

uniform float uTime;
uniform sampler2D uBack;
uniform sampler2D uMountain;

vec2 getNewUv(float power) {
    vec2 newUv = vUv;
    newUv.x += uTime * .0075 * power + (sin(vUv.y * (10. * power) + uTime) * .0025);
    return newUv;
}

void main()  {
    vec4 back = texture2D(uBack, getNewUv(1.));
    vec4 montains = texture2D(uMountain, vUv);

	gl_FragColor = vec4(mix(back, montains, montains.a > .9 ? 1. : 0.));
}