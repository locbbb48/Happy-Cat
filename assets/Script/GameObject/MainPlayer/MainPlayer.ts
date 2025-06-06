import { _decorator, Component, EventTouch, input, Input, Vec3, tween, BoxCollider2D, IPhysics2DContact, RigidBody2D } from 'cc';
import { GameObjectBase } from '../GameObjectBase';
import { GameEvent, PLAYER_DEAD } from '../../MainGameManager/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('MainPlayer')
export class MainPlayer extends GameObjectBase {
    onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact): void {
        console.log('Player collided with', otherCollider.node.name);
        this._move = false;
        GameEvent.emit(PLAYER_DEAD, { reason: 'collision', node: this.node });
    }

    @property
    jumpDuration: number = 0.3;

    @property
    jumpHeight: number = 2.5;

    @property
    private _move: boolean = false;

    @property
    private speed: Vec3 = new Vec3(1, 0, 0);

    @property
    private rb: RigidBody2D = null!;

    @property
    private MIN_Y: number = -2.5;
    @property
    private MAX_Y: number = 5;

    @property
    private _jumpY: number = 0;

    @property
    private fallSpeed: number = 2;


    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
        this.rb = this.getComponent(RigidBody2D);
        this.rb.enabled = false;
        this._move = false;
        this.rb.fixedRotation = true;
        this._jumpY = 0;
    }

    start() {
        super.start();
        this._jumpY = 0;
    }

    update(deltaTime: number) {
        if (this._move) {
            this._jumpY -= this.fallSpeed * deltaTime;

            let pos = this.node.getPosition();
            pos.x += this.speed.x * deltaTime;
            pos.y = this._jumpY;
            this.node.setPosition(pos);
        }
        this.checkPosition();
    }

    checkPosition() {
        const pos = this.node.getPosition();
        if (pos.y < this.MIN_Y) {
            pos.y = this.MIN_Y;
            this.node.setPosition(pos);
            GameEvent.emit(PLAYER_DEAD, { reason: 'fall', node: this.node });

        }
        if (pos.y > this.MAX_Y) {
            pos.y = this.MAX_Y;
            this.node.setPosition(pos);
            GameEvent.emit(PLAYER_DEAD, { reason: 'reach max height', node: this.node });
        }
    }

    onTouch(event: EventTouch) {
        if (!this._move) {
            this._move = true;
            this.rb.enabled = true;
        }
        tween(this.node).stop();

        const currentY = this._jumpY || this.node.getPosition().y;
        const targetY = Math.min(currentY + this.jumpHeight, this.MAX_Y);

        let jumpObj = { y: currentY };
        tween(jumpObj)
            .to(
                this.jumpDuration,
                { y: targetY },
                {
                    easing: "cubicOut",
                    onUpdate: () => {
                        this._jumpY = jumpObj.y;
                    }
                }
            )
            .start();
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouch, this);
    }
}
