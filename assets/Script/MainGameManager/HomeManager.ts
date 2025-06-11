import { _decorator, Component, director, Node, Animation } from 'cc';
import { AudioManager } from '../Sound/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('HomeManager')
export class HomeManager extends Component {
    @property(Node)
    homeBird: Node = null!;

    private birdAnims: string[] = ['FLY1', 'FLY2', 'FLY3'];
    private currentAnimIndex: number = 0;

    public static currentBirdAnim: string = 'FLY1';

    onEnable() {
        director.resume();
        AudioManager.instance.playSFX(3);

    }

    public loadPrototypeScene() {
        director.loadScene('Prototype');
    }

    public onNextBird() {
        this.currentAnimIndex = (this.currentAnimIndex + 1) % this.birdAnims.length;
        HomeManager.currentBirdAnim = this.birdAnims[this.currentAnimIndex];
        this.setHomeBirdAnim();
    }

    public onPreviousBird() {
        this.currentAnimIndex = (this.currentAnimIndex - 1 + this.birdAnims.length) % this.birdAnims.length;
        HomeManager.currentBirdAnim = this.birdAnims[this.currentAnimIndex];
        this.setHomeBirdAnim();
    }

    setHomeBirdAnim() {
        const anim = HomeManager.currentBirdAnim;
        const animComp = this.homeBird.getComponent(Animation);
        if (animComp) {
            animComp.play(anim);
            AudioManager.instance.playSFX(4);
        }
    }
}
