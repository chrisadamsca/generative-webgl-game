export interface IComponentData {
    name: string;
    type: string;

    setFromJSON(json: any): void;
}