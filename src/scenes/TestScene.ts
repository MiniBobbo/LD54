import { C } from "../C";
import { MapHelper } from "../helpers/MapHelper";
import { TestHelper, TestResults } from "../helpers/TestHelper";
import { LdtkReader } from "../map/LDtkReader";

export class TestScene extends Phaser.Scene {
    create() {
        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap('Level_4', 'tile');

        let md = MapHelper.LoadMap(mp);
        md.SetEmitter(this.events);

        let GoBotInstructions = TestHelper.generateInstructionLists(md.Commands, md.GoBotInstructionsAllowed);

        let allResults:TestResults[] = [];
        GoBotInstructions.forEach(element => {
            let results = TestHelper.TestInstructions(md, element);
            allResults.push(results);
        });

        console.log(`Completed for level ${md.name}`);
        console.log(`Total solutions checked : ${allResults.length}`);
        let success = allResults.filter(e=>e.success);
        console.log(`Total solutions found : ${success.length}`);

        success.sort((a:TestResults,b:TestResults)=>a.steps - b.steps);
        success.forEach(element => {
            console.log(`${element.GoBotInstructions} : ${element.steps} Steps.`);
        });

        // this.events
    }

    update() {

    }
}