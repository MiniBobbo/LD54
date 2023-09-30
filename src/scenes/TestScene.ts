import { C } from "../C";
import { MapHelper } from "../helpers/MapHelper";
import { TestHelper, TestResults } from "../helpers/TestHelper";
import { LdtkReader } from "../map/LDtkReader";

export class TestScene extends Phaser.Scene {
    create() {
        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap('Level_2', 'tile');

        let md = MapHelper.LoadMap(mp);

        let i = TestHelper.generateInstructionLists([0,1,2, 3], md.MemCount);

        let allResults:TestResults[] = [];
        i.forEach(element => {
            let results = TestHelper.TestInstructions(md, element);
            allResults.push(results);
        });

        console.log(`Completed for level ${md.name}`);
        console.log(`Total solutions checked : ${allResults.length}`);
        let success = allResults.filter(e=>e.success);
        console.log(`Total solutions found : ${success.length}`);

        success.forEach(element => {
            console.log(`${element.instructions} : ${element.steps} Steps.`);
        });
    }

    update() {

    }
}