import Phaser from "phaser";
import { C } from "../C";
import { LdtkReader } from "../map/LDtkReader";
import { GameScene } from "./GameScene";
import { TestScene } from "./TestScene";
import { GameData, LevelResultsData } from "../GameData";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;

    levelRows:number = 12;

    create() {

        this.scene.remove('game');
        this.scene.remove('inst');
        C.LoadLocalGameData();

        this.add.image(0,30,'logo').setOrigin(0,0);
        this.add.bitmapText(30,350,'5px', 'A Ludum Dare 54 Game\nCreated my MiniBobbo\n48 hour compo.').setScale(2).setInteractive()
        this.add.bitmapText(500,20,'5px', 'Select a Level').setScale(3).setInteractive()

        // this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        // this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(100,675);

        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let offset = 0;
        let results = C.gd.results;
        let count = 0;
        r.ldtk.levels.forEach(l=>{
            let levelText = `Play ${l.fieldInstances[0].__value}\n`;
            let r = C.gd.results.find(r=>r.Name == l.fieldInstances[0].__value);
            let complete = false;
            if(r == null) {
                levelText += 'No data.  Weird...';
            } else if (r.Complete) {
                levelText += `Completed: ${r.Moves} Steps`;
                complete=true;
            } else {
                levelText += 'Not complete';
            }


            let b = this.CreateButton(levelText, ()=>{C.currentLevel = l.identifier; this.StartGame(); }, complete)
            .setPosition(370 + Math.floor(count/this.levelRows) * 350,60 + offset%this.levelRows *50);
            count++;
            offset++;
        });

    }

    StartGame() {
        console.log('Start Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ this.scene.add('game', GameScene, true); this.scene.stop('menu');})
    }

    TestGame() {
        console.log('Test Button pressed');
        this.input.removeAllListeners();
        this.cameras.main.fadeOut(1000, 0,0,0);
        this.cameras.main.once('camerafadeoutcomplete', () =>{ this.scene.start('test'); this.scene.stop('menu');})
    }

    EraseSaves() {
        C.EraseSaves();
        this.scene.restart();
    }

    update(time:number, dt:number) {

    }

    CreateButton(text:string, callback:any, complete:boolean = false):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.bitmapText(0,0,'5px', text).setScale(2).setInteractive();
        t.on('pointerdown', callback, this);
        if(complete)
        t.setTint(0x33ff33);
        c.add(t);
        return c;
    }
}