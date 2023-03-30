import Experience from "webgl/Experience";
// import './scripts/login';
import './scripts/room';
import './scripts/movement';
import RoleSelection from "./WebGL/RoleSelection";

const experience = new Experience(document.querySelector("canvas#webgl"));
const roleSelection = new RoleSelection(document.querySelector("canvas#roleSelectionCanvas"));