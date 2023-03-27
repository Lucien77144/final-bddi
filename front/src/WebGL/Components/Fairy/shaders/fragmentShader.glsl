uniform float uTime;
varying float vLife;

void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5)) + ((uTime - vLife) * 0.00018);
    float strength = 0.05 / distanceToCenter - 0.1 ;

    gl_FragColor = vec4(1.0, 0.99, 0.3, strength);
}