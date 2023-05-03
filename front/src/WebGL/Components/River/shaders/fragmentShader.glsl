uniform float time;
varying vec2 vUv;

void main() {
    vec3 color = vec3(0.0);

    // On ajoute une petite onde à l'eau en utilisant la fonction sin()
    float wave = sin(vUv.x * 10.0 + time * 2.0);
    color += vec3(0.0, 0.5, 1.0) * wave * 1.0;

    gl_FragColor = vec4(color, 1.0);
}