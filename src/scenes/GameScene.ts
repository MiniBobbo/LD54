import { stat } from "fs";
import { C } from "../C";
import { Robot } from "../Entities/Robot";
import { Tile, TileType } from "../Entities/Tile";
import { Instructions } from "../enum/Instructions";
import { MapData } from "../helpers/MapData";
import { MapHelper } from "../helpers/MapHelper";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { EntityModel } from "../models/EntityModel";
import { InstructionScene } from "./InstructionScene";
import { SceneEvents } from "../events/SceneEvents";
import { MapDataStatus } from "../enum/MapDataStatus";
import { Scene } from "phaser";

export class GameScene extends Phaser.Scene {
       
    inst:InstructionScene;
    groundLayer:Phaser.GameObjects.Layer;
    midLayer:Phaser.GameObjects.Layer;
    topLayer:Phaser.GameObjects.Layer;
    private md:MapData;
    private robots:Robot[] = [];

    //These are the running variables.
    private status:PlayState = PlayState.Stopped;
    private nextDelay:number = 300;
    private currentDelay:number = 300;

    TileArray:Tile[];

    create() {
        this.cameras.main
        .setBackgroundColor(0x000000)
        .setSize(700, 800)
        // .setPosition(200,200)
        // .setZoom(2);
        this.inst = this.scene.add('inst', InstructionScene, true) as InstructionScene;

        this.groundLayer = this.add.layer().setDepth(10);
        this.groundLayer.postFX.addBloom(0xffffff,1,1,1,3);
        this.midLayer = this.add.layer().setDepth(20);
        this.topLayer = this.add.layer().setDepth(30);

        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap(C.currentLevel, 'tiles');
        this.md = MapHelper.LoadMap(mp);
        this.md.SetEmitter(this.events);

        this.CreateDisplay(mp);
        this.cameras.main.setScroll(-40,-80);
        this.inst.CreateAll(this.md);


        this.inst.events.on(SceneEvents.GO, this.Start, this);
        this.inst.events.on(SceneEvents.RESET, this.Reset, this);
        this.events.on(SceneEvents.SUCCESS, this.Success, this);



        let title = this.add.bitmapText(350,50,'5px', this.md.name).setScale(5).setScrollFactor(0,0).setOrigin(.5).setMaxWidth(700);
        title.setPosition(350, 20);
        this.topLayer.add(title);
        this.topLayer.postFX.addBloom(0xffffff, 1,1,1,2);
    }

    Success() {
        this.status = PlayState.Finished;
        
        this.groundLayer.setAlpha(.5).postFX.addBlur(0,4,4,4);
        this.midLayer.setAlpha(.5).postFX.addBlur(0,4,4,4);
        // this.topLayer.postFX.addBlur();
        let message = this.add.bitmapText(350, 300, '5px', 'Level Complete').setOrigin(.5).setScale(7).setMaxWidth(650);
        let smallmessage = this.add.bitmapText(350, 375, '5px', `Program Steps: ${this.md.ElapsedSteps}`).setOrigin(.5).setScale(5).setMaxWidth(650);

        let menu = this.add.bitmapText(350, 500, '5px', 'Back to Menu').setOrigin(.5).setScale(5).setMaxWidth(650)
        .setTint(0xff3333)
        .setInteractive().on('pointerdown', ()=>{console.log('Clicked Menu');}, this);
        

        this.topLayer.add(message);
        this.topLayer.add(smallmessage);
        this.topLayer.add(menu);
    }

    CreateDisplay(mp:LDtkMapPack) {
        mp.displayLayers.forEach(element => {
            element.setVisible(false);
        });

        this.TileArray = [];

        this.md.tiles.forEachTile(t=>{
            if(t.index == 1) {
                let tile = new Tile(this);
                tile.x = t.x;
                tile.y = t.y;
                tile.s.setPosition(t.x * C.TILE_SIZE_X, t.y * C.TILE_SIZE_Y);
                this.TileArray.push(tile);
                this.groundLayer.add(tile.s);
            }
        });

        let endTile = this.TileArray.find(t=>t.x == this.md.end.x && t.y == this.md.end.y);
        endTile.SetTileType(TileType.End);

        this.md.GoBots.forEach(gb=>{
            let r = new Robot(this, gb.ID);
            r.SetStartPosition(gb.x, gb.y, gb.d);
            this.midLayer.add(r.s);
            this.robots.push(r);
        });
    }

    update(time: number, delta: number): void {
        if(this.status == PlayState.Running) {
            this.currentDelay -= delta;
            if(this.currentDelay < 0) {
                this.Step();
            }
        }
    }

    Start() {
        this.Reset();
        //Make the programs from the InstructionScene.
        //Find the GoBot instructions.
        let gbi = this.inst.RobotInp.find(i=>i.Name == 'GoBot');
        if(gbi != null)
            this.md.GoBotInstructions = gbi.GetInstructions();

        this.md.Prepare();
        this.currentDelay = this.nextDelay;
        this.status = PlayState.Running;
    }

    Pause() {

    }

    Stop() {

    }

    Reset() {
        this.md.Reset();
        this.md.AllBots.forEach(element => {
            let r = this.robots.find(r=> r.ID == element.ID);
            r.SetPosition(element.x, element.y, element.d);
        });
        this.status = PlayState.Stopped;
    }

    SingleStep() {
        this.status = PlayState.Paused;
        this.currentDelay = this.nextDelay;
        this.Step();
    }

    Step() {
        this.currentDelay = this.nextDelay;
        this.md.Step();
        //Update the graphics.  This will be event based in the future...
        this.md.AllBots.forEach(element => {
            let r = this.robots.find(r=> r.ID == element.ID);
            r.SetPosition(element.x, element.y, element.d);
        });

        //Check if we won or lost.
        if(this.md.Status == MapDataStatus.COMPLETE) {
            this.events.emit(SceneEvents.SUCCESS);
        } else if (this.md.Status == MapDataStatus.FAILED) {
            this.events.emit(SceneEvents.FAILED);
        }

    }
}

enum PlayState {
    Stopped,
    Running,
    Paused,
    Finished
}