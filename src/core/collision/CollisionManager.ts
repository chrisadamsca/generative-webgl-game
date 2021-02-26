import { CollisionComponent } from "../components/CollisionComponent";
import { Message } from "../message/Message";

export class CollisionData {
    public a: CollisionComponent;
    public b: CollisionComponent;
    public time: number;

    public constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
        this.time = time;
        this.a = a;
        this.b = b;
    }
}

export class CollisionManager {

    private static _totalTime: number = 0;
    private static _components: CollisionComponent[] = [];
    
    private static _collisionData: CollisionData[] = []; 

    private constructor() {}

    public static registerCollisionComponent(component: CollisionComponent): void{
        CollisionManager._components.push(component);
    }

    public static unRegisterCollisionComponent(component: CollisionComponent): void{
        const index = CollisionManager._components.indexOf(component);

        if (index !== -1) {
            CollisionManager._components.slice(index, 1);
        }
    }

    public static clear(): void {
        CollisionManager._components.length = 0;
    }

    public static update(time: number): void {
        CollisionManager._totalTime += time;
        
        for (let c = 0; c < CollisionManager._components.length; c++) {
            const comp = CollisionManager._components[c];
            for (let o = 0; o < CollisionManager._components.length; o++) {
                const other = CollisionManager._components[o];
                
                // Do not check against collisions with self.
                if (comp === other) continue;

                if (comp.shape.intersects(other.shape)) {
                    
                    let exists: boolean = false;
                    for (let d = 0; d < CollisionManager._collisionData.length; d++) {
                        const data = CollisionManager._collisionData[d];
                        if ((data.a === comp && data.b === other) || (data.a === other && data.b === comp)) {
                            // We have existing data, update it.
                            comp.onCollisionUpdate(other);
                            other.onCollisionUpdate(comp);
                            data.time = CollisionManager._totalTime;
                            exists = true;
                            break;
                        }                        
                    }
                    if (!exists) {
                        // Create new collision
                        // onCollisionEntry
                        const collision = new CollisionData(CollisionManager._totalTime, comp, other);
                        comp.onCollisionEntry(other);
                        other.onCollisionEntry(comp);
                        Message.sendPrio('COLLISION_ENTRY::' + comp.name, this, collision);
                        Message.sendPrio('COLLISION_ENTRY::' + other.name, this, collision);
                        CollisionManager._collisionData.push(collision);
                    }
                }
            }
    
        }

        // Remove stale collision data
        const removeData: CollisionData[] = [];
        for (let d = 0; d < CollisionManager._collisionData.length; d++) {
            const data = CollisionManager._collisionData[d];
            if (data.time !== CollisionManager._totalTime) {
                // Old collision data
                removeData.push(data);
            }
        }

        while(removeData.length !== 0) {
            const data = removeData.shift();
            const index = CollisionManager._collisionData.indexOf(data);
            CollisionManager._collisionData.splice(index, 1);

            data.a.onCollisionExit(data.b);
            data.b.onCollisionExit(data.a);

            Message.sendPrio('COLLISION_EXIT::' + data.a.name, this, data);
            Message.sendPrio('COLLISION_EXIT::' + data.b.name, this, data);
        }
        
    }

}