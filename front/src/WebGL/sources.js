export default [
  // --------------------
  // Models : 
  // --------------------

  // gltf :
  {
    name: "foxModel",
    type: "gltf",
    path: "models/Fox/glTF/Fox.gltf",
  },

  // glb :
  {
    name: "groundModel",
    type: "glb",
    path: "models/Ground/Ground_V02.glb",
  },
  {
    name: "stoneModel",
    type: "glb",
    path: "models/Rock/Stone.glb",
  },
  
  // --------------------
  // Textures : 
  // --------------------

  // png :
  {
    name: "transition",
    type: "texture",
    path: "textures/transitions/transition.png",
  },
  {
    name: "grassDisplacementTexture",
    type: "texture",
    path: "textures/grass/Map.png",
  },
  {
    name: "stoneMaterial1",
    type: "texture",
    path: "textures/rock/Rock_V01.png",
  },
  {
    name: "stoneMaterial2",
    type: "texture",
    path: "textures/rock/Rock_V02.png",
  },
  {
    name: "stoneMaterial3",
    type: "texture",
    path: "textures/rock/Rock_V03.png",
  },

  // jpg :
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  {
    name: "cloudTexture",
    type: "texture",
    path: "img/cloud.jpg",
  },
  
  // --------------------
  // Cube Textures : 
  // --------------------
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/px.jpg",
      "textures/environmentMap/nx.jpg",
      "textures/environmentMap/py.jpg",
      "textures/environmentMap/ny.jpg",
      "textures/environmentMap/pz.jpg",
      "textures/environmentMap/nz.jpg",
    ],
  },
];