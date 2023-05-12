varying vec2 vUv;

uniform float uTime;
uniform sampler2D uBack;
uniform sampler2D uFront;

vec2 getNewUv(float power) {
    vec2 newUv = vUv;
    newUv.x += uTime * .0075 * power + (sin(vUv.y * (10. * power) + uTime) * .0025);
    return newUv;
}

void main()  {
    vec4 back = texture2D(uBack, getNewUv(1.));

	gl_FragColor = vec4(back);
}