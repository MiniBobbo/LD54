import Phaser from "phaser";
import { C } from "../C";
import { LdtkReader } from "../map/LDtkReader";
import { GameScene } from "./GameScene";
import { TestScene } from "./TestScene";

export class MainMenuScene extends Phaser.Scene {
    Title:Phaser.GameObjects.Text;
    StartButton:Phaser.GameObjects.Container;
    EraseButton:Phaser.GameObjects.Container;

    create() {
        if(C.gd == null) {
            C.gd = JSON.parse(localStorage.getItem(C.GAME_NAME));
        }

        this.scene.remove('game');
        this.scene.remove('inst');

        this.Title = this.add.text(120,30, 'GAME TITLE').setFontSize(16).setWordWrapWidth(240).setOrigin(.5,0);

        // this.StartButton = this.CreateButton('Start Game', this.StartGame).setPosition(30,50);
        // this.EraseButton = this.CreateButton('Erase Saved Data', this.EraseSaves).setPosition(200,200);

        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let offset = 0;
        r.ldtk.levels.forEach(l=>{
            // this.add.bitmapText(200, 50 + offset *50, '5px', l.identifier).setScale(3);
            // this.add.bitmapText(400, 50 + offset *50, '5px', l.fieldInstances[0].__value).setScale(3);
            this.CreateButton(`Play ${l.fieldInstances[0].__value}`, ()=>{C.currentLevel = l.identifier; this.StartGame(); })
            .setPosition(50,50 + offset *30);
            this.CreateButton(`Test ${l.fieldInstances[0].__value}`, ()=>{C.currentLevel = l.identifier; this.TestGame(); })
            .setPosition(550,50 + offset *30);
            
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

    EraseSaves(p:Phaser.Input.Pointer, localx:number, localy:number, event:Phaser.Types.Input.EventData) {
        console.log('Erase Saved Data Button Pressed');
        localStorage.setItem(C.GAME_NAME, JSON.stringify(C.gd));
    }

    update(time:number, dt:number) {

    }

    CreateButton(text:string, callback:any):Phaser.GameObjects.Container {
        let c = this.add.container();
        let t = this.add.bitmapText(0,0,'5px', text).setScale(2).setInteractive();
        t.on('pointerdown', callback, this);
        c.add(t);
        return c;
    }
}