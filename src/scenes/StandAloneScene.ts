import { C } from "../C";
import { MapHelper } from "../helpers/MapHelper";
import { TestHelper } from "../helpers/TestHelper";
import { LdtkReader } from "../map/LDtkReader";

export class StandAloneScene extends Phaser.Scene {
    started:boolean = false;
    messages:Phaser.GameObjects.Text;
    create() {
        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap('Level_8', 'tile');

        let md = MapHelper.LoadMap(mp);
        md.SetEmitter(this.events);

        let GoBotInstructions = TestHelper.generateInstructionLists(md.Commands, md.GoBotInstructionsAllowed);
        let ZoomBotInstructions = TestHelper.generateInstructionLists(md.Commands, md.ZoomBotInstructionsAllowed);

        let gbi = [5,1,5,3];
        let zbi = [2,5,5,5];

        let results = TestHelper.TestInstructions(md, gbi, zbi);

        console.log(`Results: ${results.success}`);

    }
    Init() {

    }

    update() {

    }

}