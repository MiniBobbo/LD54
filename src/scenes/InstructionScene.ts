import { C } from "../C";
import { Command } from "../Entities/Command";
import { RobotInputs } from "../Entities/RobotInputs";
import { Instructions } from "../enum/Instructions";
import { SceneEvents } from "../events/SceneEvents";
import { MapData } from "../helpers/MapData";
import { SFX } from "../helpers/SoundManager";

export class InstructionScene extends Phaser.Scene {
    selctImage:Phaser.GameObjects.Image;

    StartCommandLocation = {x:45, y:60};

    SelectedInstruction:Instructions;

    RobotInp:RobotInputs[] = [];

    emitter:Phaser.Events.EventEmitter;

    debug:Phaser.GameObjects.BitmapText;

    goText:Phaser.GameObjects.BitmapText;

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


        this.add.bitmapText(20,0, '5px', 'Commands').setScale(4);
        // this.debug = this.add.bitmapText(10,400, '5px', '').setScale(2);

        this.cameras.main.postFX.addBloom(0xffffff, 1,1,1,2);

        this.events.on(SceneEvents.SOUND, (sfx:SFX)=>{ this.emitter.emit(SceneEvents.SOUND, sfx);});
        this.events.on(SceneEvents.SELECTED, (i:number)=>{ this.selctImage.setVisible(true).setFrame(C.InstructionToString(i)); this.SelectedInstruction = i;});
        this.events.on(SceneEvents.CHANGED_INPUTS, ()=>{ this.events.emit(SceneEvents.RESET);});
        this.input.on('pointerup', ()=>{ 
            this.selctImage.setVisible(false); 
            this.SelectedInstruction = Instructions.Nothing;});

        let go = this.add.nineslice(10,550, 'atlas', 'CyberTile_3', 280, 75, 10,10,10,10)
        .setOrigin(0,0)
        .setTint(0x54ec36)
        .setInteractive();
        this.goText = this.add.bitmapText(150, go.y + 25, '5px', 'GO').setMaxWidth(280).setOrigin(.5).setScale(4);
        go.on('pointerdown', ()=> {this.TryGo(); this.sound.play(SFX.Click);});
        let stop = this.add.nineslice(10,625, 'atlas', 'CyberTile_3', 280, 50, 10,10,10,10)
        .setOrigin(0,0)
        .setTint(0xff0000)
        .setInteractive();
        this.add.bitmapText(150, stop.y + 25, '5px', 'RESET').setMaxWidth(280).setOrigin(.5).setScale(4);
        stop.on('pointerdown', ()=> {this.Reset(); this.sound.play(SFX.Click);});
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
        let offset = 0;
        md.InputsAllowed.forEach(element =>{
            switch (element) {
                case 'GoBot':
                    this.CreateInputs('GoBot', md.GoBotInstructionsAllowed, offset);
                    offset++;
                    break;
                case 'ZoomBot':
                    this.CreateInputs('ZoomBot', md.ZoomBotInstructionsAllowed, offset);
                    offset++;
                    break;
                case 'Sub1':
                    this.CreateInputs('Sub1', md.Sub1InstructionsAllowed, offset);
                    offset++;
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

    private CreateInputs(name:string, count:number, offsetCount:number = 0) {
            let i = new RobotInputs(name, this, count);
            i.c.setPosition(15, 160 + 100*offsetCount);
            this.RobotInp.push(i);
    }
}

