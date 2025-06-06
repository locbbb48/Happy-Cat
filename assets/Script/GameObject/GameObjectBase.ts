import { _decorator, Component, Node, BoxCollider2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameObjectBase')
export abstract class GameObjectBase extends Component {
    protected boxCollider: BoxCollider2D = null!;

    start() {
        this.boxCollider = this.getComponent(BoxCollider2D);
        if (this.boxCollider) {
            this.boxCollider.on('onBeginContact', this.onBeginContact, this);
        }
    }

    abstract onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact): void;
}
