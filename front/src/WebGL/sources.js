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
    name: "urmaModel",
    type: "glb",
    path: "models/Urma/Urma.glb",
  },
  {
    name: "riverRocksModel",
    type: "glb",
    path: "models/River/Rocks_river.glb",
  },
  {
    name: "bridgeModel",
    type: "glb",
    path: "models/River/Bridge.glb",
  },
  {
    name: "controlBaseModel",
    type: "glb",
    path: "models/ControlPanel/Base.glb",
  },
  {
    name: "diskOneModel",
    type: "glb",
    path: "models/ControlPanel/Disk_1.glb",
  },
  {
    name: "diskTwoModel",
    type: "glb",
    path: "models/ControlPanel/Disk_2.glb",
  },
  {
    name: "diskThreeModel",
    type: "glb",
    path: "models/ControlPanel/Disk_3.glb",
  },
  {
    name: "controlReferenceModel",
    type: "glb",
    path: "models/ControlPanel/Reference.glb",
  },

  // --------------------
  // Audios :
  // --------------------

  {
    name: "forestAudio",
    type: "audio",
    path: "/sounds/forest.mp3",
  },
  {
    name: "runUrmaAudio",
    type: "audio",
    path: "/sounds/dirtRun.mp3",
  },
  {
    name: "runWingsAudio",
    type: "audio",
    path: "/sounds/wings.wav",
  },
  {
    name: "treeModel",
    type: "glb",
    path: "models/Tree/Tree.glb",
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
    name: "dudvMap",
    type: "texture",
    path: "textures/water/hOIsXiZ.png",
  },
  {
    name: "mountain",
    type: "texture",
    path: "textures/background/moutain.jpg",
  },
  {
    name: "mountainS",
    type: "texture",
    path: "textures/background/moutain_shadow.jpg",
  },
  {
    name: "mountainF",
    type: "texture",
    path: "textures/background/moutain_fog.jpg",
  },

  // jpg :
  {
    name: "cloudTexture",
    type: "texture",
    path: "img/cloud.jpg",
  },
  {
    name: "treeMask",
    type: "texture",
    path: "textures/tree/mask3.png",
  },
  {
    name: "dirtTexture",
    type: "texture",
    path: "textures/grass/dirt.jpg",
  },
  {
    name: "mudTexture",
    type: "texture",
    path: "textures/grass/mud.jpg",
  },
  {
    name: "displacementMap",
    type: "texture",
    path: "textures/grass/displacement.jpg",
  },
  {
    name: "mask",
    type: "texture",
    path: "textures/grass/mask.jpg",
  },
  {
    name: "cloudBack",
    type: "texture",
    path: "textures/background/back.jpg",
  },
  {
    name: "noiseMap",
    type: "texture",
    path: "textures/water/gPz7iPX.jpg",
  },

  // --------------------
  // Cube Textures :
  // --------------------
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/px.png",
      "textures/environmentMap/nx.png",
      "textures/environmentMap/py.png",
      "textures/environmentMap/ny.png",
      "textures/environmentMap/pz.png",
      "textures/environmentMap/nz.png",
    ],
  },
];
