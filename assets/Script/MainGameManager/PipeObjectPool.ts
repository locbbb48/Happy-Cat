import { Node, Prefab, instantiate } from 'cc';

export class PipeObjectPool {
    private pool: Node[] = [];
    private prefab: Prefab;

    constructor(prefab: Prefab, initialSize: number = 20) {
        this.prefab = prefab;
        for (let i = 0; i < initialSize; i++) {
            const obj = instantiate(this.prefab);
            obj.active = false;
            this.pool.push(obj);
        }
    }

    getPipe(parent: Node): Node {
        let pipe: Node;
        if (this.pool.length > 0) {
            pipe = this.pool.pop()!;
        } else {
            pipe = instantiate(this.prefab);
        }
        pipe.active = true;
        pipe.setParent(parent);
        return pipe;
    }

    releasePipe(pipe: Node) {
        pipe.active = false;
        pipe.setParent(null);
        this.pool.push(pipe);
    }

    clear() {
        for (const pipe of this.pool) {
            pipe.destroy();
        }
        this.pool.length = 0;
    }
}
