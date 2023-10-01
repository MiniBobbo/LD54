import { GameScene } from "./GameScene";

export class TransitionScene extends Phaser.Scene {
    create() {
        this.scene.remove('game');
        this.scene.remove('inst');
        this.time.addEvent({
            delay:100, 
            callbackScope:this,
            callback:()=>{this.scene.add('game', GameScene, true); this.scene.stop('menu');}
        });
    }
}