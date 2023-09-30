import { C } from "../C";
import { Command } from "../Entities/Command";
import { Instructions } from "../enum/Instructions";
import { SceneEvents } from "../events/SceneEvents";

export class InstructionScene extends Phaser.Scene {
    CommandZones:Phaser.GameObjects.Zone[];
    selctImage:Phaser.GameObjects.Image;

    StartCommandLocation = {x:40, y:70};

    SelectedInstruction:Instructions;

    create() {
        this.CommandZones = [];

        this.cameras.main
        .setSize(300,700)
        .setBackgroundColor(0x494d7eff)
        .setPosition(700,0);

        // this.add.image(30,60, 'atlas', 'Instructions_Forward_0');
        // this.add.image(90,60, 'atlas', 'Instructions_Left_0');
        // this.add.image(150,60, 'atlas', 'Instructions_Right_0');

        this.selctImage = this.add.image(0,0,'atlas', 'Instructions_Forward_0').setDepth(100).setAlpha(.5).setVisible(false);


        this.add.bitmapText(10,0, '5px', 'Commands').setScale(4);

        this.cameras.main.postFX.addBloom(0xffffff, 1,1,1,2);

        this.events.on(SceneEvents.SELECTED, (i:number)=>{ this.selctImage.setVisible(true).setFrame(C.InstructionToString(i)); this.SelectedInstruction = i;});
        this.input.on('pointerup', ()=>{ this.selctImage.setVisible(false);});

        // let c1 = new Command(this);
        // c1.SetCommand(30,70, Instructions.Forward);
        // let c2 = new Command(this);
        // c2.SetCommand(90,70, Instructions.Left);
        // let c3 = new Command(this);
        // c3.SetCommand(150,70, Instructions.Right);

        

    }


    update(time: number, delta: number): void {
        // let p = this.input.activePointer.worldX
        this.selctImage.setPosition(this.input.activePointer.worldX - 700, this.input.activePointer.worldY);
    }

    CreateCommands(instructions:number[]) {
        for (let index = 0; index < instructions.length; index++) {
        let c1 = new Command(this);
        c1.SetCommand(this.StartCommandLocation.x + 60*index,this.StartCommandLocation.y, instructions[index]);

        }
    }
    

}