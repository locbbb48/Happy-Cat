import { _decorator, EventTouch, input, Input, Vec2, BoxCollider2D, IPhysics2DContact, RigidBody2D } from 'cc';
import { GameObjectBase } from '../GameObjectBase';
const { ccclass, property } = _decorator;

@ccclass('MainPlayer')
export class MainPlayer extends GameObjectBase {
    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact): void {
        console.log('Player va chạm với', otherCollider.node.name);
        this._move = false;
    }
    onEndContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact): void {
        throw new Error('Method not implemented.');
    }

    @property
    private rb: RigidBody2D = null!;

    @property
    private speed: number = 1;

    @property
    private _move: boolean = false;

    start() {
        super.start();
        this.node.setPosition(0, 0, 0);
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
        this.rb = this.getComponent(RigidBody2D);

    }

    update(deltaTime: number) {
        if (this._move) {
            const pos = this.node.getPosition();
            pos.x += this.speed * deltaTime;
            this.node.setPosition(pos);
        }
        this.checkPosition();
    }

    @property
    private MIN_Y: number = -2.5;
    @property
    private MAX_Y: number = 5;

    checkPosition() {
        const pos = this.node.getPosition();
        if (pos.y < this.MIN_Y) {
            pos.y = this.MIN_Y;
            this.node.setPosition(pos);
        }
        if (pos.y > this.MAX_Y) {
            pos.y = this.MAX_Y;
            this.node.setPosition(pos);
        }
    }

    onTouch(event: EventTouch) {
        console.log('Touched at:', event.getLocation());
        this._move = true;
        this.rb.applyLinearImpulseToCenter(new Vec2(0, this.speed), true);
    }

    onDestroy() {
    input.off(Input.EventType.TOUCH_START, this.onTouch, this);
    }

}


