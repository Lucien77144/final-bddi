uniform float time;
uniform vec3 fairyPosition;

vec3 move(vec3 position, float time) {
    return position;
}

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tmpPos = texture2D(positionTexture, uv);
	vec3 position = tmpPos.xyz;

	vec3 target;

	if (mod(time + uv.x * 1000. + uv.y * 1000., 1000.0) <= 100.0) { 
		target = vec3(fairyPosition.x, fairyPosition.y, fairyPosition.z);
	}else {
		target = move(position, time);
	}

	gl_FragColor = vec4(target, 0.);
	
}
