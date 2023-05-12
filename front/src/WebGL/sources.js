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
  // {
  //   name: "groundModel",
  //   type: "glb",
  //   path: "models/Ground/Ground.glb",
  // },
  {
    name: "groundModel",
    type: "glb",
    path: "models/Ground/Ground_V3.glb",
  },
  {
    name: "stoneModel",
    type: "glb",
    path: "models/Rock/Stone.glb",
  },
  {
    name: "columnModel",
    type: "glb",
    path: "models/Column/Column.glb",
  },
  {
    name: "fairyModel",
    type: "glb",
    path: "models/Fairy/Fairy.glb",
  },
  {
    name: "treeModel",
    type: "glb",
    path: "models/Tree/trees.glb",
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
