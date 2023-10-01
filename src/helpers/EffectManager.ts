import { EffectTypes } from "../enum/EffectTypes";
import { SceneEvents } from "../events/SceneEvents";
import { GameScene } from "../scenes/GameScene";

export class EffectManager {
    scene:GameScene;
    active:boolean;
    EffectGroup:Phaser.GameObjects.Sprite[];

    constructor(scene:GameScene) {
        this.scene = scene;
        this.EffectGroup = [];
        this.scene.events.on(SceneEvents.EFFECT, this.LaunchEffect, this);
    }
    
    LaunchEffect(x:number, y:number, type:EffectTypes) {
        let a = this.EffectGroup.find(e=>!e.anims.isPlaying);  
        if(a == undefined) {
            a = this.scene.add.sprite(0,0,'atlas', 0);
            this.scene.midLayer.add(a);
            this.EffectGroup.push(a);
        }

        a.setAngle(0).setFlip(false, false).setScale(1,1).setDepth(10).setVisible(true);
        a.once('animationcomplete', ()=>{a.setVisible(false)});

        switch (type) {
            case EffectTypes.Explode:
                a.setPosition(x + 8, y -30).setScale(4)
                .anims.play('explode')
                ;
                break;
            default:
                break;
        }

    }
}