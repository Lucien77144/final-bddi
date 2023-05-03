uniform float time;
uniform vec2 fairyPosition;

vec3 dust(vec3 position, float time) {
    vec3 speed = vec3(0.0, -0.1, 0.0); // Vitesse de chute des particules
    float dt = 0.1; // Intervalle de temps pour calculer la position des particules

    vec3 vel = speed * time * 0.00001; // Calculer la vitesse actuelle des particules
    vec3 newPos = position + vel * dt; // Calculer la nouvelle position des particules

    return newPos;
}

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tmpPos = texture2D(positionTexture, uv);
	vec3 position = tmpPos.xyz;

	vec3 target;

	if (mod(time + uv.x * 100., 160.0) <= 0.5) { 
		target = vec3(fairyPosition.x, fairyPosition.y, 1.);
	}else {
		target = dust(position, time);
	}

	gl_FragColor = vec4(target, 0.);
	
}
