 uniform sampler2D uCloud;
 uniform sampler2D tDisplacement;

  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;

  vec3 green = vec3(0.2, 0.6, 0.3);

  void main() {
    vec3 color = mix(green * 0.8, green, vPosition.y);
    color = mix(color, vec3(0.5, 0.5, 0.5), 0.4);

    float lighting = normalize(dot(vNormal, vec3(10)));
    gl_FragColor = vec4(color + lighting * 0.03, 1.0);
  }