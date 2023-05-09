uniform float uTime;
uniform vec3 uFairyPosition;
uniform float uFairyDistance;

float rand(vec2 co){
return (fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) -.5) * 0.5;
}

vec3 move(vec3 position, float time, vec2 uv) {
	float angle = mix(-1., 1., uv.y);
	vec2 dir = vec2(cos(angle), sin(angle));
	vec3 offset = vec3(rand(uv), rand(uv + vec2(1.0, 0.0)), rand(uv + vec2(0.0, 1.0))) * 0.01; 
	return position + vec3(dir * uFairyDistance * 0.005, 0.0) + offset * uFairyDistance;
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tmpPos = texture2D(positionTexture, uv);
	vec3 position = tmpPos.xyz;

	vec3 target;

	float life = mod(uTime + uv.x * 2000. + uv.y * 2000., 2000.); // vie qui va de 0 à 1000

	float minLife = 1400.;

	if (life >= minLife) { 
		target = vec3(uFairyPosition.x - .5 , uFairyPosition.y, uFairyPosition.z);
	}else {
		target = move(position, uTime, uv);
	}

	// target = vec3(uFairyPosition.x , uFairyPosition.y, uFairyPosition.z) + vec3(0., uv.y, uv.x) ;

	gl_FragColor = vec4(target, 1.);
}
