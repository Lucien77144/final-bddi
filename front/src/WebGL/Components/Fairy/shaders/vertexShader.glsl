uniform float uPixelRatio;
uniform float uSize;

attribute float aScale;

varying vec2 vUv;
uniform sampler2D positionTexture;
attribute vec2 reference;

void main()
{
    vUv = reference;

	vec3 pos = texture(positionTexture, vUv).xyz;
    
    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}