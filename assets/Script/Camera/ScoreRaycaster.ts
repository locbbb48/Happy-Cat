import { _decorator, Component, Camera, Vec2, PhysicsSystem2D, ERaycast2DType, view, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreRaycaster')
export class ScoreRaycaster extends Component {
    @property(Camera)
    camera: Camera = null!;

    // Hoặc nếu script gắn trực tiếp lên camera, có thể dùng this.node.getComponent(Camera)
    private pipes: Node[] = []; // Chứa các pipe hiện tại

    // Gán pipes từ GameManager khi spawn/hoặc truyền vào từ Inspector

    update(dt: number) {
        // Lấy tọa độ giữa màn hình (hoặc điểm tùy ý)
        const viewSize = view.getVisibleSize();
        const centerScreen = new Vec2(viewSize.width / 2, viewSize.height / 2);

        // Chuyển sang tọa độ thế giới
        const centerScreen3D = new Vec3(centerScreen.x, centerScreen.y, 0);
        const worldPos = this.camera.screenToWorld(centerScreen3D);

        // Raycast dọc trục Y tại vị trí X = worldPos.x
        const rayStart = new Vec2(worldPos.x, -10000);
        const rayEnd   = new Vec2(worldPos.x, 10000);

        // Thực hiện raycast
        const results = PhysicsSystem2D.instance.raycast(rayStart, rayEnd, ERaycast2DType.All);

        for (const result of results) {
            const collider = result.collider;
            if (collider.node.name === 'Pipe' && !(collider.node as any)._scored) {
                (collider.node as any)._scored = true;
                console.log('Pipe crossed! +1 Score');
            }
        }
    }
}