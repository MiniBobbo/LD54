import { C } from "../C";
import { MapHelper } from "../helpers/MapHelper";
import { TestHelper, TestResults } from "../helpers/TestHelper";
import { LdtkReader } from "../map/LDtkReader";

export class TestScene extends Phaser.Scene {
    started:boolean = false;
    messages:Phaser.GameObjects.Text;
    create() {
        if(!this.started)
            this.Init();
        this.messages.text = '';
        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap(C.currentLevel, 'tile');

        let md = MapHelper.LoadMap(mp);
        md.SetEmitter(this.events);

        let GoBotInstructions = TestHelper.generateInstructionLists(md.Commands, md.GoBotInstructionsAllowed);
        let ZoomBotInstructions = TestHelper.generateInstructionLists(md.Commands, md.ZoomBotInstructionsAllowed);
        let Sub1Instructions = TestHelper.generateInstructionLists(md.Commands, md.Sub1InstructionsAllowed);

        let allResults:TestResults[] = [];
        GoBotInstructions.forEach(gbi => {
            ZoomBotInstructions.forEach(zbi => {
                Sub1Instructions.forEach(sub => {
                    let results = TestHelper.TestInstructions(md, gbi, zbi, sub);
                    allResults.push(results);
                });
            });
        });

        let b = this.add.bitmapText(600,600, '5px', 'Menu').setScale(4).setTint(0xff0000).setInteractive();
        b.on('pointerdown', ()=>{this.scene.start('menu');});

        let t = '';
        t += `Completed for level ${md.name}\nTotal solutions checked : ${allResults.length}\n`;
        let success = allResults.filter(e=>e.success);
        t+=`Total solutions found : ${success.length}\n\n`;

        success.sort((a:TestResults,b:TestResults)=>a.steps - b.steps);
        success.forEach(element => {
            t+=`Go: ${element.GoBotInstructions} || Zoom ${element.ZoomBotInstructions} || Sub ${element.SubInstructions} : ${element.steps} Steps.\n`;
        });

        this.messages.setText(t);

    }
    Init() {
        this.messages = this.add.text(10,10,'');

    }

    update() {

    }
}