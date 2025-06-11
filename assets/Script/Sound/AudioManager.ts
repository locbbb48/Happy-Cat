import { _decorator, AudioClip, AudioSource, director, resources, Node, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    private static _instance: AudioManager | null = null;

    public static get instance(): AudioManager {
        if (!this._instance) {
            const node = new Node('AudioManager');
            director.getScene().addChild(node);
            this._instance = node.addComponent(AudioManager);
        }
        return this._instance;
    }

    @property([AudioClip])
    public sfxList: AudioClip[] = [];

    @property([AudioClip])
    public bgmList: AudioClip[] = [];

    private sfxAudio: AudioSource = null!;
    private bgmAudio: AudioSource = null!;

    onLoad() {
        AudioManager._instance = this;
        // Tạo 2 audio source để tách kênh SFX và BGM
        this.sfxAudio = this.node.addComponent(AudioSource);
        this.bgmAudio = this.node.addComponent(AudioSource);
        this.bgmAudio.loop = true;
    }

    // ----- SFX -----
    public playSFX(index: number, volume: number = 1) {
        if (this.sfxList[index]) {
            this.sfxAudio.clip = this.sfxList[index];
            this.sfxAudio.volume = volume;
            this.sfxAudio.playOneShot(this.sfxList[index]);
        }
    }

    // ----- BGM -----
    public playBGM(index: number, volume: number = 1) {
        if (this.bgmList[index]) {
            this.bgmAudio.clip = this.bgmList[index];
            this.bgmAudio.volume = volume;
            this.bgmAudio.play();
        }
    }

    public stopBGM() {
        this.bgmAudio.stop();
    }

    public pauseBGM() {
        this.bgmAudio.pause();
    }

    public resumeBGM() {
        this.bgmAudio.play();
    }

    // ----- Volume control -----
    public setSFXVolume(volume: number) {
        this.sfxAudio.volume = volume;
    }

    public setBGMVolume(volume: number) {
        this.bgmAudio.volume = volume;
    }
}
