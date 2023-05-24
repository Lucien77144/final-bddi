// // Variables to pass from vertex to fragment shader
// varying vec3 vNormal;
// varying vec3 vPosition;
// varying vec2 vUv;

// uniform sampler2D uMask;

// void main() {
//     vUv = uv;
//     vNormal = normal;
//     vPosition = position;

//      vec4 modifiedPosition;

//     float redness = texture2D(uMask, vUv).r; // Obtenez la valeur de rouge de votre texture à partir des coordonnées UV

//     // Calculez une position de base modifiée en déplaçant le vertex le long de l'axe des Z en fonction de la distance maximale
//     vec4 basePosition = vec4(position.x - 10., position.y, position.z - 10., 1.0);

//     // Calculez une position modifiée en interpolant entre la position de base et la position d'origine du vertex
//     modifiedPosition = mix(basePosition, vec4(position, 1.0), redness);

//     gl_Position = projectionMatrix * modelViewMatrix * modifiedPosition;
// }

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D uMask;

void main(){
	vUv = uv;
    vNormal = normal;
    vPosition = position;

    float redness = texture2D(uMask, vUv).r;
    vPosition = vPosition + normal * redness * .5;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
