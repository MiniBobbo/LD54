import { C } from "../C";
import { Instructions } from "../enum/Instructions";
import { SceneEvents } from "../events/SceneEvents";

export class Command {
    scene:Phaser.Scene;
    s:Phaser.GameObjects.Image;
    i:number = 1;

    constructor(scene:Phaser.Scene) {
        this.scene = scene;
        this.s = scene.add.image(0,0,'atlas', 'Instructions_Forward_0').setInteractive();
        this.s.on('pointerdown', this.Down, this);
    }
    Down() {
        this.scene.events.emit(SceneEvents.SELECTED, this.i);
    }

    SetCommand(x:number, y:number, i:Instructions) {
        this.s.setPosition(x, y);
        this.i = i;
        this.s.setFrame(C.InstructionToString(i));
    }
}