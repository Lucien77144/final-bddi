uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform float uGravity;

attribute float aScale;
attribute vec3 aCoordsMax;
attribute float life;

varying float vLife;

float getPos(float coord, float limit, float lf) {
    float newDist = coord * (limit * min(lf / 1000., 1.));
    return newDist * limit / coord + (limit * lf/1000.);
}

vec3 getNewPosition(vec4 proj, vec3 maxCoords, float life) {
    return vec3(
        proj.x + getPos(proj.x, maxCoords.x, life),
        proj.y + getPos(proj.y, maxCoords.y, life),
        proj.z + getPos(proj.z, maxCoords.z, life)
    );
}

void main()
{
    vLife = life;
    float lifeTime = uTime - life;

    float speed = 0.001;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y -= speed * (lifeTime * uGravity);
    modelPosition.x -= speed * (lifeTime * uGravity);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = vec4(getNewPosition(projectionPosition, aCoordsMax, lifeTime), projectionPosition.w);

    gl_PointSize = uSize * aScale * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
}