import { C } from "../C";
import { Instructions } from "../enum/Instructions";
import { MapHelper } from "../helpers/MapHelper";
import { LdtkReader } from "../map/LDtkReader";
import { InstructionScene } from "./InstructionScene";

export class GameScene extends Phaser.Scene {
       
    inst:Phaser.Scene;
    create() {
        this.cameras.main.setBackgroundColor(0x272744ff);
        this.inst = this.scene.add('inst', InstructionScene, true);

        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap(C.currentLevel, 'tile');

        let md = MapHelper.LoadMap(mp);

        MapHelper.TestMap(md);
        // let i = [Instructions.Forward ];

        // let maxSteps:number = 500;
        // i.forEach(element => {
        //     md.Step(element);  
        // });

    }

    

    
}