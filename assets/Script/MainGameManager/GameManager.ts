import { _decorator, Component, director, Node } from 'cc';
import { GAME_START, GameEvent, PLAYER_DEAD } from './GameEvent';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({ type: Node })
    UIDead: Node = null!;

    onLoad() {
        GameEvent.on(PLAYER_DEAD, this.onPlayerDead, this);
        GameEvent.on(GAME_START, this.onGameStart, this);
    }
    onGameStart() {
        console.log('Game started');
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
        }
    }
}
