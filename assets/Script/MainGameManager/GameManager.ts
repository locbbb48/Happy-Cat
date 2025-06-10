import { _decorator, Component, Prefab, Node, instantiate, Vec3, director, RichText } from 'cc';
import { GameEvent, PLAYER_DEAD } from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    deadRichText: Node = null!;

    @property(Node)
    score: Node = null!;

    @property
    scoreValue: number = 0;

    @property(Prefab)
    bgrPrefab: Prefab = null!;

    @property(Node)
    player: Node = null!;

    @property
    bgrWidth: number = 1920;

    private bgrQueue: Node[] = [];

    @property
    private bgrCount: number = 3;

    @property(Prefab)
    pipePrefab: Prefab = null!;


    @property
    pipeMinX: number = -960;

    @property
    pipeMaxX: number = 960;

    @property
    pipeMinY: number = -110;

    @property
    pipeMaxY: number = 110;

    @property
    pipePerBackground: number = 3;

    @property
    pipePerBackgroundMax: number = 7;

    onLoad() {
        GameEvent.on(PLAYER_DEAD, this.onPlayerDead, this);
        this.schedule(this.increasePipeCount, 10);
    }

    onEnable() {
        this.deadRichText.active = false;

        this.score.getComponent(RichText)!.string = this.scoreValue.toString();

        this.pipePerBackground = 3;

        for (let bgr of this.bgrQueue) {
            bgr.destroy();
        }
        this.bgrQueue = [];

        for (let i = 0; i < this.bgrCount; ++i) {
            const bgr = instantiate(this.bgrPrefab);
            bgr.setParent(this.node);
            bgr.setPosition(new Vec3(i * this.bgrWidth, 0, 0));
            this.bgrQueue.push(bgr);
        }
        this.scheduleOnce(() => {
            for (let bgr of this.bgrQueue) {
                this.initPipeOnBackground(bgr);
            }
        }, 0.1);
        this.schedule(this.increaseScore, 1);
    }

    increaseScore() {
        this.scoreValue++;
        this.score.getComponent(RichText)!.string = this.scoreValue.toString();
    }

    onPlayerDead(data: { reason: string, node: any }) {
        if (this.deadRichText) {
            this.deadRichText.active = true;
            console.log('Player dead:');
        }

        director.pause();

        setTimeout(() => {
            director.pause();
            setTimeout(() => {
                director.loadScene('HomeScene');
            }, 2000);
        }, 300);
    }

    increasePipeCount() {
        if (this.pipePerBackground < this.pipePerBackgroundMax) {
            this.pipePerBackground++;
            console.log(`Increased pipePerBackground to ${this.pipePerBackground}`);
        }
    }

    updatePipeOnBackground(background: Node) {
        const pipeList = (background as any).pipeList as Node[] || [];

        while (pipeList.length < this.pipePerBackground) {
            const pipe = instantiate(this.pipePrefab);
            pipe.parent = background;
            pipeList.push(pipe);
        }

        for (let i = this.pipePerBackground; i < pipeList.length; i++) {
            pipeList[i].active = false;
        }

        this.resetpipeOnBackground(background);
    }

    initPipeOnBackground(background: Node) {
    let pipeList = (background as any).pipeList as Node[] || [];

    for (let pipe of pipeList) {
        pipe.destroy();
    }

    pipeList = [];
    (background as any).pipeList = pipeList;

    for (let i = 0; i < this.pipePerBackground; i++) {
        const pipe = instantiate(this.pipePrefab);
        pipe.parent = background;
        pipeList.push(pipe);
    }

    this.resetpipeOnBackground(background);
}


    resetpipeOnBackground(background: Node) {
        const pipeList = (background as any).pipeList as Node[];
        if (!pipeList) return;

        const usedX: number[] = [];

        // Kiểm tra nếu là background đầu tiên
        const isFirstBgr = background === this.bgrQueue[0];
        const pipeMinX = isFirstBgr ? 100 : this.pipeMinX;

        for (let pipe of pipeList) {
            let randX = 0;
            let tries = 0;
            const maxTries = 200;

            do {
                randX = Math.random() * (this.pipeMaxX - pipeMinX) + pipeMinX;
                tries++;
            } while (
                usedX.some(prevX => Math.abs(randX - prevX) < 200) &&
                tries < maxTries
            );

            usedX.push(randX);

            const randY = Math.random() * (this.pipeMaxY - this.pipeMinY) + this.pipeMinY;
            pipe.setPosition(new Vec3(randX, randY, 0));
            pipe.active = true;
        }
    }


    update(deltaTime: number) {
        if (!this.player) return;

        // Nếu player tiến gần cuối bgr đầu (bgrQueue[0])
        const firstBgr = this.bgrQueue[0];
        const playerPosX = this.player.position.x;

        if (playerPosX > firstBgr.position.x + this.bgrWidth) {
            const movedBgr = this.bgrQueue.shift()!;
            const lastBgr = this.bgrQueue[this.bgrQueue.length - 1];
            movedBgr.setPosition(new Vec3(lastBgr.position.x + this.bgrWidth, 0, 0));
            this.bgrQueue.push(movedBgr);
            this.initPipeOnBackground(movedBgr);
        }
    }

    onDestroy() {
        GameEvent.off(PLAYER_DEAD, this.onPlayerDead, this);
    }
}
