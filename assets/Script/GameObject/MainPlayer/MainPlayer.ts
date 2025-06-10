import { _decorator, Component, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, Vec2, input, Input, EventTouch } from 'cc';
import { GameEvent, PLAYER_DEAD } from '../../MainGameManager/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('MainPlayer')
export class MainPlayer extends Component {
    private rb: RigidBody2D | null = null;

    @property
    speedX: number = 5;

    @property
    speedY: number = 5;

    @property
    maxSpeedY: number = 10;

    onEnable() {
        this.node.setPosition(-100, 0, 0);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.rb = this.getComponent(RigidBody2D);
        this.schedule(this.increaseSpeed, 5);
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
    }

    onTouch(event: EventTouch) {
        if (this.rb) {
            this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, 0);
            const v = this.rb.linearVelocity;
            this.rb.linearVelocity = new Vec2(v.x, Math.min(v.y + this.speedY, this.maxSpeedY));
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name === 'CactusUp' || otherCollider.node.name === 'CactusDown') {
            GameEvent.emit(PLAYER_DEAD, { reason: 'hitPipe', node: this.node });
            console.log('Player hitting Pipe');
        }
    }

    increaseSpeed() {
        this.speedX += 0.5;
    }

    update(deltaTime: number) {
        if (this.rb) {
            const v = this.rb.linearVelocity;
            this.rb.linearVelocity = new Vec2(this.speedX, v.y);
        }
        this.node.angle = Math.min(this.rb.linearVelocity.y, 5);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouch, this);
    }
}
