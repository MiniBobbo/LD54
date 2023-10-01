import { C } from "../C";
import { Instructions } from "../enum/Instructions";
import { SceneEvents } from "../events/SceneEvents";
import { SFX } from "../helpers/SoundManager";
import { InstructionScene } from "../scenes/InstructionScene";

export class InputBox {
    scene:InstructionScene;
    s:Phaser.GameObjects.Image;
    i:number = Instructions.Nothing;

    constructor(scene:Phaser.Scene) {
        this.scene = scene as InstructionScene;
        this.s = scene.add.image(0,0,'atlas', 'CyberTile_4').setInteractive();
        this.s.on('pointerup', ()=>{
            this.i = this.scene.SelectedInstruction;
            this.s.setFrame(C.InstructionToString(this.i));
            this.scene.events.emit(SceneEvents.CHANGED_INPUTS);
            this.scene.sound.play(SFX.Click);
        }, this);
    }

}