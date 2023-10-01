import { C } from "../C";
import { MapHelper } from "../helpers/MapHelper";
import { TestHelper } from "../helpers/TestHelper";
import { LdtkReader } from "../map/LDtkReader";

export class StandAloneScene extends Phaser.Scene {
    started:boolean = false;
    messages:Phaser.GameObjects.Text;
    create() {
        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap('Level_7', 'tile');

        let md = MapHelper.LoadMap(mp);
        md.SetEmitter(this.events);

        let gbi = [6];
        let zbi = [6];
        let sub = [3,1,1];

        let results = TestHelper.TestInstructions(md, gbi, zbi, sub);

        console.log(`Results: ${results.success}`);

    }
    Init() {

    }

    update() {

    }

}