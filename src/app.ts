import { Engine } from "./core/Engine"

let engine: Engine;

window.onload = () => {
    engine = new Engine().start();
    engine.resize();
}

window.onresize = () => {
    engine.resize();
}