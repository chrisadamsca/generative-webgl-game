import { Vector3 } from "../math/Vector3";
import { BaseBehavior } from "./BaseBehavior";
import { BehaviorManager } from "./BehaviorManager";
import { IBehavior } from "./IBehavior";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehaviorData } from "./IBehaviorData";

export class RotationBehaviorData implements IBehaviorData {

    public name: string;
    public rotation: Vector3 = Vector3.zero;

    public setFromJSON(json: any): void {
        if (json.name === undefined) {
            throw new Error(`Name must be defined in BehaviorData.`)
        }

        this.name = String(json.name);

        if (json.rotation !== undefined) {
            this.rotation.setFromJSON(json.rotation);
        }

    }

}

export class RotationBehaviorBuilder implements IBehaviorBuilder {

    public get type(): string {
        return 'rotation';
    };

    public buildFromJSON(json: any): IBehavior {
        const data = new RotationBehaviorData();
        data.setFromJSON(json);
        return new RotationBehavior(data);
    }

}

export class RotationBehavior extends BaseBehavior {

    private _rotation: Vector3

    public constructor(data: RotationBehaviorData) {
        super(data);

        this._rotation = data.rotation;
    }

    public update(time: number): void {
        this._owner.transform.rotation.add(this._rotation);        

        super.update(time);
    }

}

BehaviorManager.registerBuilder(new RotationBehaviorBuilder());