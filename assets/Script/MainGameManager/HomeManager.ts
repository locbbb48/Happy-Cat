import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('HomeManager')
export class HomeManager extends Component {
    public loadPrototypeScene() {
        director.loadScene('PrototypeScene', () => {
        });
    }
}
