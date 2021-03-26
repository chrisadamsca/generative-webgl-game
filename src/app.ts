import { Engine } from "./core/Engine"

let engine: Engine;

window.onload = () => {
    engine = new Engine().start();
}

window.onresize = () => {
    engine.resize();
}