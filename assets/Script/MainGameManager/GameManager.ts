import { _decorator, Component, Prefab, Node, instantiate, Vec3, director } from 'cc';
import { GameEvent, PLAYER_DEAD } from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    deadRichText: Node = null!;

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
    cactusUpPrefab: Prefab = null!;

    @property(Prefab)
    cactusDownPrefab: Prefab = null!;

    @property
    cactusMinX: number = -960;

    @property
    cactusMaxX: number = 960;

    @property
    cactusPerBackground: number = 12;

    onLoad() {
        this.scheduleOnce(() => {
            for (let bgr of this.bgrQueue) {
                this.initCactusOnBackground(bgr);
            }
        }, 0.1); // Đợi bgrQueue được fill sau start
        GameEvent.on(PLAYER_DEAD, this.onPlayerDead, this);

    }

    start() {
        for (let i = 0; i < this.bgrCount; ++i) {
            const bgr = instantiate(this.bgrPrefab);
            bgr.setParent(this.node);
            bgr.setPosition(new Vec3(i * this.bgrWidth, 0, 0));
            this.bgrQueue.push(bgr);
        }
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

    initCactusOnBackground(background: Node) {
        (background as any).cactusList = [];
        for (let i = 0; i < this.cactusPerBackground; i++) {
            const cactusType = Math.random() > 0.5 ? 'up' : 'down';
            const prefab = cactusType === 'up' ? this.cactusUpPrefab : this.cactusDownPrefab;
            const cactus = instantiate(prefab);
            cactus.parent = background;
            (background as any).cactusList.push(cactus);
        }
        this.resetCactusOnBackground(background);
    }

    resetCactusOnBackground(background: Node) {
        const cactusList = (background as any).cactusList as Node[];
        if (!cactusList) return;
        for (let cactus of cactusList) {
            const randX = Math.random() * (this.cactusMaxX - this.cactusMinX) + this.cactusMinX;
            const posy = cactus.position.y;
            cactus.setPosition(new Vec3(randX, posy, 0));
            cactus.active = true;
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
            this.resetCactusOnBackground(movedBgr);
        }
    }

    onDestroy() {
        GameEvent.off(PLAYER_DEAD, this.onPlayerDead, this);
    }
}
