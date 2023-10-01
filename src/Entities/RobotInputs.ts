import { Instructions } from "../enum/Instructions";
import { InstructionScene } from "../scenes/InstructionScene";
import { InputBox } from "./InputBox";

export class RobotInputs {
    Name:string = '';
    scene:InstructionScene;
    Inputs:InputBox[] = [];
    c:Phaser.GameObjects.Container;

    constructor(name:string, scene:InstructionScene, count:number = 4) {
        this.scene = scene;
        this.Name = name;
        this.c = scene.add.container(0,0);
        let t = scene.add.bitmapText(0,0,'5px', name).setScale(4);
        this.c.add(t);

        for (let index = 0; index < count; index++) {
            let x = 30 + (index%4) * 70;
            let y = 60 + (Math.floor(index/4) * 80)  
            let ib = new InputBox(this.scene);
            ib.s.setPosition(x, y);
            this.c.add(ib.s);
            this.Inputs.push(ib);
        }
    }

    GetInstructions():Instructions[] {
        let i:Instructions[] = [];
        this.Inputs.forEach(element => {
            i.push(element.i);
        });
        return i.filter(num => num != 0);
    }

}