import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollow')
export class CameraFollow extends Component {
    @property({ type: Node })
    target: Node = null;

    @property
    offset: Vec3 = new Vec3(0, 0, 10);

    update(deltaTime: number) {
        if (this.target) {
            let targetPos = this.target.getPosition();
            this.node.setPosition(
                targetPos.x + this.offset.x,
                this.node.position.y,
                this.node.position.z
            );
        }
    }
}
