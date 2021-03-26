import { IBehavior } from "./IBehavior";
import { IBehaviorBuilder } from "./IBehaviorBuilder";

export class BehaviorManager {

    private static _registeredBuilders: {[type: string]: IBehaviorBuilder} = {};

    public static registerBuilder(builder: IBehaviorBuilder): void {
        BehaviorManager._registeredBuilders[builder.type] = builder;
    }

    public static extractBehavior(json: any): IBehavior {
        if (json.type != undefined) {
            if (BehaviorManager._registeredBuilders[json.type] !== undefined) {
                return BehaviorManager._registeredBuilders[json.type].buildFromJSON(json);
            }
            throw new Error(`BehaviorManager error: type is missing in JSON or builder is not registered for this type.`);
        }
    }

}