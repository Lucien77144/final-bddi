uniform float time;
uniform vec2 fairyPosition;

vec3 dust(vec3 position, float time) {
    vec3 speed = vec3(0.0, -0.1, 0.0); // Vitesse de chute des particules
    vec3 gravity = vec3(0.0, -0.1, 0.0); // Gravité pour accélérer la chute des particules
    float dt = 0.1; // Intervalle de temps pour calculer la position des particules

    vec3 vel = speed + gravity * time * 0.00001; // Calculer la vitesse actuelle des particules
    vec3 newPos = position + vel * dt; // Calculer la nouvelle position des particules

    return newPos;
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tmpPos = texture2D(positionTexture, uv);
	vec3 position = tmpPos.xyz;

	vec3 target;

	if (mod(time + uv.x * 100., 160.0) <= 0.5) { 
		vec2 randomUV = fract(vec2(uv.x * 7.0 + uv.y * 13.0, uv.x * 19.0 + uv.y * 23.0)); // Générer des coordonnées uv aléatoires en fonction de la position
		target = vec3(fairyPosition.x + (randomUV.x - 0.5)  * 0.5, fairyPosition.y + (randomUV.y - 0.5) * 0.5, 1.);
	}else {
		target = dust(position, time);
	}

	gl_FragColor = vec4(target, 0.);
	
}
