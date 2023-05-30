// precision highp float;
// precision highp int;

// // Default THREE.js uniforms available to both fragment and vertex shader
// uniform mat4 modelMatrix;

// uniform vec3 colorMap[4];
// uniform float brightnessThresholds[3];
// uniform vec3 lightPosition;

// // Variables passed from vertex to fragment shader
// varying vec3 vNormal;
// varying vec3 vPosition;

// uniform sampler2D uMask;
// varying vec2 vUv;

// vec4 getTexture2D(sampler2D map) {
// 	return texture2D(map, vUv);
// }

// void main() {
// 	vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
// 	vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );
// 	vec3 lightVector = normalize( lightPosition - worldPosition );
// 	float brightness = dot( worldNormal, lightVector );

// 	vec4 final;

// 	if (brightness > brightnessThresholds[0])
// 		final = vec4(colorMap[0], 1);
// 	else if (brightness > brightnessThresholds[1])
// 		final = vec4(colorMap[1], 1);
// 	else if (brightness > brightnessThresholds[2])
// 		final = vec4(colorMap[2], 1);
// 	else
// 		final = vec4(colorMap[3], 1);

// 	gl_FragColor = vec4( final );

// }

uniform mat4 modelMatrix;

uniform sampler2D uMask;
uniform vec3 colorLight;
uniform vec3 colorDark;
uniform vec3 lightPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 worldPosition = (modelMatrix * vec4(vPosition, 1.0)).xyz;
    vec3 worldNormal = normalize(vec3(modelMatrix * vec4(vNormal, 0.0)));
    vec3 lightVector = normalize(lightPosition - worldPosition);
    float brightness = dot(worldNormal, lightVector);

    float redIntensity = texture2D(uMask, vUv).r;
    float blueIntensity = texture2D(uMask, vUv).b;

    if (redIntensity != 0.0 && blueIntensity == 0.0) {
        float smoothness = 1.0;
        redIntensity = pow(redIntensity, 1.0 / smoothness);

        vec3 mixedColor = mix(colorLight, colorDark, redIntensity);
        vec3 finalColor = mixedColor * brightness;

        gl_FragColor = vec4(finalColor, 1.0);
    } else {
        discard;
    }
}

