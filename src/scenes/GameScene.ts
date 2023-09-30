import { LdtkReader } from "../map/LDtkReader";
import { InstructionScene } from "./InstructionScene";

export class GameScene extends Phaser.Scene {
       
    inst:Phaser.Scene;
    create() {
        this.cameras.main.setBackgroundColor(0x272744ff);
        this.inst = this.scene.add('inst', InstructionScene, true);
        let r = new LdtkReader(this, this.cache.json.get('levels'));

    }

    

    
}