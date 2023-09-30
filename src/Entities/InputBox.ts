import { C } from "../C";
import { InstructionScene } from "../scenes/InstructionScene";

export class InputBox {
    scene:InstructionScene;
    s:Phaser.GameObjects.Image;
    i:number = 1;

    constructor(scene:Phaser.Scene) {
        this.scene = scene as InstructionScene;
        this.s = scene.add.image(0,0,'atlas', 'CyberTile_4').setInteractive();
        this.s.on('pointerup', ()=>{
            this.i = this.scene.SelectedInstruction;
            this.s.setFrame(C.InstructionToString(this.i));
        }, this);
    }

}