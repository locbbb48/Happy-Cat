import { _decorator, Component, EventTouch, input, Input, KeyCode, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('newbieTranform')
export class newbieTranform extends Component {
    private _direction: number = -1;

    start() {
        console.log('newbieTranform start called');

        this.node.setPosition(0, 0, 0);

        input.on(Input.EventType.TOUCH_START, this.onTouch, this);
    }

    update(deltaTime: number) {
        let pos = this.node.getPosition();

        pos.x += 0.1 * this._direction;

        if (pos.x <= -10) {
            this._direction = 1;
        }
        else if (pos.x >= 10) {
            this._direction = -1;
        }

        pos.y += 0.1 * this._direction;

        if(pos.y <= -10) {
            this._direction = 1;
        }
        else if(pos.y >= 10) {
            this._direction = -1;
        }

        this.node.setPosition(pos);
    }

    onTouch(event: EventTouch) {
        console.log('Touched at:', event.getLocation());

        this._direction *= -1;

    }
}


