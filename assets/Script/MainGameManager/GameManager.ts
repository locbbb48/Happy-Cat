import { _decorator, Component, director, instantiate, Node, Prefab } from 'cc';
import { GameEvent, PLAYER_DEAD } from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Node })
    UIDead: Node = null!;

    onLoad() {
        GameEvent.on(PLAYER_DEAD, this.onPlayerDead, this);
        this.initBackgrounds();
    }
    start() {
        this.UIDead.active = false;
    }
    onPlayerDead(data: { reason: string, node: any }) {
        console.log('Player died:', data.reason);
        if (this.UIDead) {
            this.UIDead.active = true;
        }
    }
    onDestroy() {
        GameEvent.off(PLAYER_DEAD, this.onPlayerDead, this);
    }


    @property({ type: [Node] })
    backgroundQueue: Node[] = [];

    @property
    backgroundWidth: number = 19;

    @property({ type: Node })
    player: Node = null!;


    update(dt: number) {
        const playerX = this.player.position.x;

        let firstBgr = this.backgroundQueue[0];
        let lastBgr = this.backgroundQueue[this.backgroundQueue.length - 1];

        if (firstBgr.position.x + this.backgroundWidth / 2 < playerX - this.backgroundWidth) {
            firstBgr.setPosition(
                lastBgr.position.x + this.backgroundWidth,
                firstBgr.position.y,
                firstBgr.position.z
            );

            this.backgroundQueue.push(this.backgroundQueue.shift()!);
            this.resetCactusOnBackground(firstBgr);
        }
    }

    @property({ type: Prefab })
    cactusUpPrefab: Prefab = null!;

    @property({ type: Prefab })
    cactusDownPrefab: Prefab = null!;

    @property
    cactusMinX: number = -9.5;

    @property
    cactusMaxX: number = 9.5;

    @property
    cactusPerBackground: number = 3;

    initBackgrounds() {
        for (let bgr of this.backgroundQueue) {
            this.initCactusOnBackground(bgr);
        }
    }

    initCactusOnBackground(background: Node) {
        background['cactusList'] = [];
        for (let i = 0; i < this.cactusPerBackground; i++) {
            const cactusType = Math.random() > 0.5 ? 'up' : 'down';
            const prefab = cactusType === 'up' ? this.cactusUpPrefab : this.cactusDownPrefab;
            const cactus = instantiate(prefab);
            cactus.parent = background;
            background['cactusList'].push(cactus);
        }
        this.resetCactusOnBackground(background);
    }

    resetCactusOnBackground(background: Node) {
        for (let cactus of background['cactusList']) {
            const randX = Math.random() * (this.cactusMaxX - this.cactusMinX) + this.cactusMinX; let y = 0;
            const posy = cactus.position.y;
            cactus.setPosition(randX, posy, 0);
            cactus.active = true;
        }
    }
}
