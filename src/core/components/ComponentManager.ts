import { IComponent } from "./IComponent";
import { IComponentBuilder } from "./IComponentBuilder";

export class ComponentManager {

    private static _componentCount: number = 0;

    private static _registeredBuilders: {[type: string]: IComponentBuilder} = {};

    public static registerBuilder(builder: IComponentBuilder): void {
        console.warn('new builder registered: ', builder.type)
        ComponentManager._registeredBuilders[builder.type] = builder;
    }

    public static extractComponent(json: any): IComponent {
        if (json.type != undefined) {
            if (ComponentManager._registeredBuilders[json.type] !== undefined) {
                return ComponentManager._registeredBuilders[json.type].buildFromJSON(json);
            }
            throw new Error(`ComponentManager error: type is missing in JSON or builder is not registered for this type.`);
        }
    }

    public static registerComponent(): number{
        return ++ComponentManager._componentCount;
    }

}