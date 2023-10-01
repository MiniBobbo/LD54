import { SceneEvents } from "../events/SceneEvents";

export class SM {
    scene:Phaser.Scene;
    private sfx:SFX[] = [];

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.scene.events.on(SceneEvents.SOUND, (sfx:SFX)=> {this.Play(sfx);}, this);
        this.scene.events.on('update', this.update, this);
    }

    update() {
        let uniqueSfx = Array.from(new Set(this.sfx));
        uniqueSfx.forEach(element => {
            this.scene.sound.play(element);            
        });
        this.sfx = [];
    }

    Play(sfx:SFX) {
        this.sfx.push(sfx);
    }



}

export enum SFX {
    Explode = 'explode',
    Move = 'move',
    Teleport_up = 'teleportup',
    Teleport_Down = 'tpdown',
    Jump='jump',
    TilesAppear = 'tilesappear',
    Click = 'click'
}