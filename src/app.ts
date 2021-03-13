import { ItemComponent } from "./core/components/ItemComponent";
import { Engine } from "./core/Engine"

let engine: Engine;

let inventory: ItemComponent[];

window.onload = () => {
    engine = new Engine().start();
}

window.onresize = () => {
    engine.resize();
}