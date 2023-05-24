varying vec2 vUv;

uniform float uTime;
uniform sampler2D uBack;
uniform sampler2D uMountain;
uniform sampler2D uMountainS;

uniform vec3 uPrimary;
uniform vec3 uSecondary;
uniform vec3 uSecondary2;
uniform vec3 uShadowColor;

vec2 getNewUv(float power) {
    vec2 newUv = vUv;
    newUv.x += uTime * .0075 * power + (sin(vUv.y * (10. * power) + uTime) * .0025);
    return newUv;
}

void main()  {
    vec4 back = texture2D(uBack, getNewUv(1.));
    vec4 montains = texture2D(uMountain, vUv);
    vec4 shadow = texture2D(uMountainS, vUv);

    vec3 secondary = mix(uSecondary, uSecondary2, vUv.y);
    vec3 resultMountain = mix(uPrimary, secondary, montains.b);

    vec3 front = mix(resultMountain, uShadowColor, shadow.r);

    vec3 color = mix(front, back.rgb, (montains.r < 1.) && (montains.r < .5) ? montains.r * 2. : 1.);
    
	gl_FragColor = vec4(color, 1.);
}