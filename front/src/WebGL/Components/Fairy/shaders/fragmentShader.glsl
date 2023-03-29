uniform float uTime;
varying float vLife;
varying vec2 vUv;

void main()
{
    // float distanceToCenter = distance(vUv, vec2(0.5)) ;

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5)) + ((uTime - vLife) * 0.00005);
    
    float strength = 0.02 / distanceToCenter - 0.1 ;

   gl_FragColor = vec4(1.0, 0.99, 0.3, strength);
}