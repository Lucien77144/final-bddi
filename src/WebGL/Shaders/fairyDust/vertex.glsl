uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute float life;

varying float vLife;
void main()
{
    vLife = life;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float spreadFactor = (0.0005 * (uTime / life));

    modelPosition.y -= (uTime - life) * spreadFactor;
    modelPosition.x -= (uTime - life) * aScale * spreadFactor;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}