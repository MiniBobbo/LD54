import { InstructionScene } from "../scenes/InstructionScene";
import { InputBox } from "./InputBox";

export class RobotInputs {
    Name:string = '';
    scene:InstructionScene;
    Inputs:InputBox[];
    c:Phaser.GameObjects.Container;

    constructor(name:string, scene:InstructionScene, count:number = 4) {
        this.scene = scene;
        this.Name = name;
        this.c = scene.add.container(0,0);
        let t = scene.add.bitmapText(0,0,'5px', name).setScale(4);
        this.c.add(t);

        for (let index = 0; index < count; index++) {
            let ib = new InputBox(this.scene);
            ib.s.setPosition(30 + index * 70, 70);
            this.c.add(ib.s);
        }
    }

}