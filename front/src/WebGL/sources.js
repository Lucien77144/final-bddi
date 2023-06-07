export default [
  // --------------------
  // Models :
  // --------------------

  // gltf :
  {
    name: "bushModel",
    type: "gltf",
    path: "models/Bush/Bush.gltf",
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
    name: "ponchoModel",
    type: "glb",
    path: "models/Poncho/Poncho.glb",
  },
  {
    name: "bridgeModel",
    type: "glb",
    path: "models/Bridge/Bridge.glb",
  },
  {
    name: "steleModel",
    type: "glb",
    path: "models/Stele/Stele.glb",
  },
  {
    name: "letterModel",
    type: "glb",
    path: "models/Letter/Letter.glb",
  },
  {
    name: "stairsModel",
    type: "glb",
    path: "models/Stairs/Stairs.glb",
  },
  {
    name: "entranceModel",
    type: "glb",
    path: "models/Temple/Entrance.glb",
  },
  {
    name: "treeModel",
    type: "glb",
    path: "models/Tree/Tree.glb",
  },
  {
    name: "signModel",
    type: "glb",
    path: "models/Sign/Sign.glb",
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
    path: "/sounds/wings.mp3",
  },

  // --------------------
  // Textures :
  // --------------------

  // png :
  {
    name: "dudvMapWater",
    type: "texture",
    path: "textures/water/dudv.png",
  },
  {
    name: "treeMask",
    type: "texture",
    path: "textures/tree/mask.png",
  },

  // jpg :
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
    name: "grassMask",
    type: "texture",
    path: "textures/grass/mask.jpg",
  },
  {
    name: "cloudsBack",
    type: "texture",
    path: "textures/background/back.jpg",
  },
  {
    name: "noiseMapWater",
    type: "texture",
    path: "textures/water/noise.jpg",
  },
  {
    name: "mountain",
    type: "texture",
    path: "textures/background/moutain.jpg",
  },
  {
    name: "mountainShadow",
    type: "texture",
    path: "textures/background/moutain_shadow.jpg",
  },
  {
    name: "mountainFog",
    type: "texture",
    path: "textures/background/moutain_fog.jpg",
  },
  {
    name: "stairsTexture",
    type: "texture",
    path: "textures/stairs/texture.jpg",
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

  // --------------------
  // SVG :
  // --------------------

  {
    name: "symbol1",
    type: "svg",
    path: "svg/Symbol_1.svg",
  },
  {
    name: "symbol2",
    type: "texture",
    path: "svg/Symbol_2.svg",
  },
  {
    name: "symbol14",
    type: "texture",
    path: "svg/Symbol_14.svg",
  },
  {
    name: "symbol21",
    type: "texture",
    path: "svg/Symbol_21.svg",
  },
];
