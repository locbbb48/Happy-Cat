import { _decorator, Component, Collider2D, IPhysics2DContact, Contact2DType, RigidBody2D, ERigidBody2DType, Vec2, input, Input, EventTouch, Animation, Node, RichText } from 'cc';
import { GameEvent, PLAYER_DEAD } from '../../MainGameManager/GameEvent';
import { HomeManager } from '../../MainGameManager/HomeManager';
import { AudioManager } from '../../Sound/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('MainPlayer')
export class MainPlayer extends Component {
    private isStarted: boolean = false;

    private rb: RigidBody2D | null = null;

    @property
    speedX: number = 5;

    @property
    speedY: number = 5;

    @property
    maxSpeedY: number = 10;

    private tmpSpeed: number = this.speedX;

    @property(Node)
    touch1: Node = null!;

    @property(Node)
    touch2: Node = null!;

    @property(Node)
    score: Node = null!;

    @property
    scoreValue: number = 0;

    onEnable() {
        this.isStarted = false;
        this.tmpSpeed = this.speedX;
        this.speedX = 0;
        this.scoreValue = 0;
        this.score.getComponent(RichText)!.string = this.scoreValue.toString();

        const anim = HomeManager.currentBirdAnim;

        const animComp = this.getComponent(Animation);
        if (animComp) {
            animComp.play(anim);
        }
        this.node.setPosition(-100, 0, 0);
        const collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        this.rb = this.getComponent(RigidBody2D);
        this.schedule(this.increaseSpeed, 5);
        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
        this.rb.type = ERigidBody2DType.Static;
    }

    onTouch(event: EventTouch) {
        AudioManager.instance.playSFX(4);
        if (!this.isStarted) {
            this.isStarted = true;
            this.touch1.active = false;
            this.touch2.active = false;
            if (this.rb) {
                this.rb.linearVelocity = new Vec2(this.speedX, 0);
            }
            this.rb.type = ERigidBody2DType.Dynamic;
            this.speedX = this.tmpSpeed;
        }

        if (this.rb) {
            this.rb.linearVelocity = new Vec2(this.rb.linearVelocity.x, 0);
            const v = this.rb.linearVelocity;
            this.rb.linearVelocity = new Vec2(v.x, Math.min(v.y + this.speedY, this.maxSpeedY));
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        if (otherCollider.node.name === 'CactusUp' || otherCollider.node.name === 'CactusDown') {
            AudioManager.instance.playSFX(1);
            GameEvent.emit(PLAYER_DEAD, { reason: 'hitPipe', node: this.node });
        }
        if( otherCollider.node.name === 'TriggerPoint') {
            let pos = otherCollider.node.getWorldPosition();
            console.log('Trigger hit at ', pos);
            this.increaseScore();
        }
    }

    increaseScore() {
        AudioManager.instance.playSFX(2);
        this.scoreValue++;
        this.score.getComponent(RichText)!.string = this.scoreValue.toString();
    }

    increaseSpeed() {
        this.speedX += 0.5;
    }

    update(deltaTime: number) {
        if (this.rb) {
            const v = this.rb.linearVelocity;
            this.rb.linearVelocity = new Vec2(this.speedX, v.y);
        }
        this.node.angle = this.rb.linearVelocity.y;
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouch, this);
    }
}

