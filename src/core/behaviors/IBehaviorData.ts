import { IBehavior } from "./IBehavior";

export interface IBehaviorData {
    name: string;

    setFromJSON(json: any): void;
}