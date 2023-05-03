uniform vec3 uBaseColor;
uniform vec3 uSize;
uniform sampler2D uMask;
uniform sampler2D uBaseTexture;

varying vec2 vUv;

vec4 getTexture2D(sampler2D map) {
	return texture2D(map, vUv);
}

vec3 getTextureColor() {
	vec2 repeat = vec2(uSize.xz) / 3.;
  	vec2 uv = fract(vUv * repeat);
  	vec2 smooth_uv = repeat * uv;
  	vec4 duv = vec4(dFdx(smooth_uv), dFdy(smooth_uv));

  	return textureGrad(uBaseTexture, uv, duv.xy, duv.zw).rgb;
}

void main() {
  	float mask = getTexture2D(uMask).r * uSize.y;

	gl_FragColor = vec4(mix(uBaseColor, getTextureColor(), mask), 1.);
}