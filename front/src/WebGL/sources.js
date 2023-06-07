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
    name: "fragmentModel",
    type: "glb",
    path: "models/Fragment/Fragment.glb",
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
  {
    name: "stoneModel",
    type: "glb",
    path: "models/Rocks/Stone.glb",
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
  {
    name: "fairyTexture",
    type: "texture",
    path: "textures/fairy/baseTexture.png",
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
    name: "s1-1",
    type: "svg",
    path: "svg/Level 1 - 1.svg",
  },
  {
    name: "s1-2",
    type: "texture",
    path: "svg/Level 1 - 2.svg",
  },
  {
    name: "s1-3",
    type: "texture",
    path: "svg/Level 1 - 3.svg",
  },
  {
    name: "s1-4",
    type: "texture",
    path: "svg/Level 1 - 4.svg",
  },
  {
    name: "s1-5",
    type: "texture",
    path: "svg/Level 1 - 5.svg",
  },
  {
    name: "s1-6",
    type: "texture",
    path: "svg/Level 1 - 6.svg",
  },
  {
    name: "s1-7",
    type: "texture",
    path: "svg/Level 1 - 7.svg",
  },
  {
    name: "s1-8",
    type: "texture",
    path: "svg/Level 1 - 8.svg",
  },
  {
    name: "s2-1",
    type: "texture",
    path: "svg/Level 2 - 1.svg",
  },
  {
    name: "s2-2",
    type: "texture",
    path: "svg/Level 2 - 2.svg",
  },
  {
    name: "s2-3",
    type: "texture",
    path: "svg/Level 2 - 3.svg",
  },
  {
    name: "s2-4",
    type: "texture",
    path: "svg/Level 2 - 4.svg",
  },
  {
    name: "s2-5",
    type: "texture",
    path: "svg/Level 2 - 5.svg",
  },
  {
    name: "s2-6",
    type: "texture",
    path: "svg/Level 2 - 6.svg",
  },
  {
    name: "s2-7",
    type: "texture",
    path: "svg/Level 2 - 7.svg",
  },
  {
    name: "s2-8",
    type: "texture",
    path: "svg/Level 2 - 8.svg",
  },
  {
    name: "s3-1",
    type: "texture",
    path: "svg/Level 3 - 1.svg",
  },
  {
    name: "s3-2",
    type: "texture",
    path: "svg/Level 3 - 2.svg",
  },
  {
    name: "s3-3",
    type: "texture",
    path: "svg/Level 3 - 3.svg",
  },
  {
    name: "s3-4",
    type: "texture",
    path: "svg/Level 3 - 4.svg",
  },
  {
    name: "s3-5",
    type: "texture",
    path: "svg/Level 3 - 5.svg",
  },
  {
    name: "s3-6",
    type: "texture",
    path: "svg/Level 3 - 6.svg",
  },
  {
    name: "s3-7",
    type: "texture",
    path: "svg/Level 3 - 7.svg",
  },
  {
    name: "s3-8",
    type: "texture",
    path: "svg/Level 3 - 8.svg",
  },
  
];
