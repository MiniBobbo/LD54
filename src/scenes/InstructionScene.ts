import { C } from "../C";
import { Command } from "../Entities/Command";
import { RobotInputs } from "../Entities/RobotInputs";
import { Instructions } from "../enum/Instructions";
import { SceneEvents } from "../events/SceneEvents";
import { MapData } from "../helpers/MapData";

export class InstructionScene extends Phaser.Scene {
    selctImage:Phaser.GameObjects.Image;

    StartCommandLocation = {x:40, y:60};

    SelectedInstruction:Instructions;

    RobotInp:RobotInputs[] = [];

    emitter:Phaser.Events.EventEmitter;

    debug:Phaser.GameObjects.BitmapText;

    create() {
        this.cameras.main
        .setSize(300,700)
        // .setBackgroundColor(0x494d7eff)
        .setPosition(700,0);
        let g = this.add.graphics();
        g.fillStyle(0x000000, .5);
        this.add.nineslice(5,5,'atlas', 'CyberTile_3', 290, 690, 10,10,10,10)
        .setOrigin(0,0).setDepth(1)
        .postFX.addBloom(0xffffff,1,1,1,2);
        ;

        // this.add.image(30,60, 'atlas', 'Instructions_Forward_0');
        // this.add.image(90,60, 'atlas', 'Instructions_Left_0');
        // this.add.image(150,60, 'atlas', 'Instructions_Right_0');

        this.selctImage = this.add.image(0,0,'atlas', 'Instructions_Forward_0').setDepth(100).setAlpha(.5).setVisible(false);


        this.add.bitmapText(10,0, '5px', 'Commands').setScale(4);
        this.debug = this.add.bitmapText(10,400, '5px', '').setScale(2);

        this.cameras.main.postFX.addBloom(0xffffff, 1,1,1,2);

        this.events.on(SceneEvents.SELECTED, (i:number)=>{ this.selctImage.setVisible(true).setFrame(C.InstructionToString(i)); this.SelectedInstruction = i;});
        this.events.on(SceneEvents.CHANGED_INPUTS, ()=>{ this.events.emit(SceneEvents.RESET);});
        this.input.on('pointerup', ()=>{ 
            this.selctImage.setVisible(false); 
            this.SelectedInstruction = Instructions.Nothing;});

        // let c1 = new Command(this);
        // c1.SetCommand(30,70, Instructions.Forward);
        // let c2 = new Command(this);
        // c2.SetCommand(90,70, Instructions.Left);
        // let c3 = new Command(this);
        // c3.SetCommand(150,70, Instructions.Right);

        
        let go = this.add.nineslice(10,600, 'atlas', 'CyberTile_3', 280, 60, 10,10,10,10)
        .setOrigin(0,0)
        .setTint(0x54ec36)
        .setInteractive();
        this.add.bitmapText(150, go.y + 25, '5px', 'GO').setMaxWidth(280).setOrigin(.5).setScale(4);



        go.on('pointerdown', ()=> {this.TryGo();});
    }

    SetEmitter(e:Phaser.Events.EventEmitter) {
        this.emitter = e;
    }

    TryGo() {
        //TODO: Check for blank commands.  Don't allow the user to enter nothing. 
        this.events.emit(SceneEvents.GO);
    }

    Reset() {
        this.events.emit(SceneEvents.RESET);
    }


    update(time: number, delta: number): void {
        // let p = this.input.activePointer.worldX
        // this.cameras.main.getWorldPoint();
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        this.selctImage.setPosition(this.input.activePointer.worldX, this.input.activePointer.worldY);
        // this.debug.setText(`${this.selctImage.x}, ${this.selctImage.y}`);
    }

    CreateAll(md:MapData) {
        this.CreateCommands(md.Commands);
        md.InputsAllowed.forEach(element =>{
            switch (element) {
                case 'GoBot':
                    this.CreateInputs('GoBot', md.GoBotInstructionsAllowed);
                    break;
            
                default:
                    break;
            }
        })
    }

    private CreateCommands(instructions:number[]) {
        for (let index = 0; index < instructions.length; index++) {
        let c1 = new Command(this);
        let x = (index%4) * 70;
        let y = (Math.floor(index/4) * 70)  

        c1.SetCommand(this.StartCommandLocation.x + x,this.StartCommandLocation.y + y, instructions[index]);

        }
    }

    private CreateInputs(name:string, count:number) {
            let i = new RobotInputs(name, this, count);
            i.c.setPosition(10, 160);
            this.RobotInp.push(i);
    }
}

