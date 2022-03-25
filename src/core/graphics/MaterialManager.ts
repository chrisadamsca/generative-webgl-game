import { Material } from "./Material";

class MaterialReferenceNode {
    public material: Material;
    public referenceCount: number = 1;

    public constructor(material: Material) {
        this.material = material;
    }
}

export class MaterialManager {

    private static _matrials: {[name: string]: MaterialReferenceNode} = {};

    private constructor() {}

    public static registerMaterial(material: Material): void {
        if (MaterialManager._matrials[material.name] === undefined) {
            MaterialManager._matrials[material.name] = new MaterialReferenceNode(material);
        }
    }

    public static getMaterial(materialName: string): Material {
        if (MaterialManager._matrials[materialName] === undefined) {
            return undefined;
        } else {
            MaterialManager._matrials[materialName].referenceCount++;
            return MaterialManager._matrials[materialName].material;
        }
    }

    public static releaseMaterial(materialName: string): void {
        if (MaterialManager._matrials[materialName] === undefined) {
            // console.warn(`Cannot release material (${materialName}), since it has not been registered.`);
        } else {
            MaterialManager._matrials[materialName].referenceCount--;
            if (MaterialManager._matrials[materialName].referenceCount < 1) {
                MaterialManager._matrials[materialName].material.destroy();
                MaterialManager._matrials[materialName].material = undefined;
                delete MaterialManager._matrials[materialName];
            }
        }
    }

}