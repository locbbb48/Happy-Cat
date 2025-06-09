import { _decorator, Component, Collider2D, IPhysics2DContact, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        // Đăng ký sự kiện va chạm
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            console.log('Đăng ký xong event cho:', this.node.name);
        }
    }

    // Hàm xử lý va chạm
    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // Log ra tên node của 2 vật va chạm
        console.log('contact_');

        console.log('Va chạm giữa:', selfCollider.node.name, 'và', otherCollider.node.name);
    }
}
