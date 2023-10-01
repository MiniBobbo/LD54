import { stat } from "fs";
import { C } from "../C";
import { Robot } from "../Entities/Robot";
import { Tile, TileType } from "../Entities/Tile";
import { Instructions } from "../enum/Instructions";
import { MapData } from "../helpers/MapData";
import { MapHelper } from "../helpers/MapHelper";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { Direction, EntityModel } from "../models/EntityModel";
import { InstructionScene } from "./InstructionScene";
import { SceneEvents } from "../events/SceneEvents";
import { MapDataStatus } from "../enum/MapDataStatus";
import { Scene } from "phaser";
import { EffectManager } from "../helpers/EffectManager";
import { EntityEvents } from "../enum/EntityEvents";
import { SFX, SM } from "../helpers/SoundManager";

export class GameScene extends Phaser.Scene {
       
    inst:InstructionScene;
    bgLayer:Phaser.GameObjects.Layer;
    groundLayer:Phaser.GameObjects.Layer;
    midLayer:Phaser.GameObjects.Layer;
    topLayer:Phaser.GameObjects.Layer;
    private md:MapData;
    private robots:Robot[] = [];

    EM:EffectManager;

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

        this.EM = new EffectManager(this);
        new SM(this);

        this.bgLayer = this.add.layer().setDepth(5);
        this.groundLayer = this.add.layer().setDepth(10);
        this.groundLayer.postFX.addBloom(0xffffff,1,1,1,3);
        this.midLayer = this.add.layer().setDepth(20);
        this.topLayer = this.add.layer().setDepth(30);

        //Create BG Layer
        this.CreateBGLayer();

        let r = new LdtkReader(this, this.cache.json.get('levels'));
        let mp = r.CreateMap(C.currentLevel, 'tiles');
        this.md = MapHelper.LoadMap(mp);
        this.md.SetEmitter(this.events);

        this.CreateDisplay(mp);
        this.cameras.main.setScroll(-40,-80);
        this.inst.CreateAll(this.md);

        let menu = this.add.bitmapText(5,560, '5px', 'MENU').setScale(3).setTint(0xff0000).setInteractive();
        menu.on('pointerdown', ()=>{this.scene.start('menu');}, this);
        this.topLayer.add(menu);

        this.inst.events.on(SceneEvents.GO, this.Start, this);
        this.inst.events.on(SceneEvents.RESET, this.Reset, this);
        this.events.on(SceneEvents.SUCCESS, this.Success, this);
        this.events.on(SceneEvents.FAILED, this.Fail, this);
        this.events.on(EntityEvents.DESTROYED, (id:number)=>{this.robots.find(r=>r.ID == id).s.setVisible(false)}, this);
        this.events.on(EntityEvents.TELEPORT, (id:number)=>{this.robots.find(r=>r.ID == id).Teleport()}, this);
        this.events.on(EntityEvents.MOVE, (id:number, x:number, y:number, d:Direction)=>{this.robots.find(r=>r.ID == id).MoveTo(x,y,d)}, this);
        this.events.on(EntityEvents.JUMP, (id:number, x:number, y:number, d:Direction)=>{this.robots.find(r=>r.ID == id).JumpTo(x,y,d)}, this);



        let title = this.add.bitmapText(350,50,'5px', this.md.name).setScale(5).setScrollFactor(0,0).setOrigin(.5).setMaxWidth(700);
        title.setPosition(350, 20);
        this.topLayer.add(title);
        this.topLayer.postFX.addBloom(0xffffff, 1,1,1,2);
    }

    CreateBGLayer() {

    }

    Fail() {
        this.time.addEvent({
            delay:500,
            callbackScope:this,
            callback:()=>{this.Reset();}
        });
    }

    Success() {
        this.status = PlayState.Finished;
        // this.events.emit();
        
        this.time.addEvent({
            delay:500,
            callbackScope:this,
            callback:()=>{
                this.groundLayer.setAlpha(.5).postFX.addBlur(0,4,4,4);
                this.midLayer.setAlpha(.5).postFX.addBlur(0,4,4,4);
                // this.topLayer.postFX.addBlur();
                let message = this.add.bitmapText(350, 300, '5px', 'Level Complete').setOrigin(.5).setScale(7).setMaxWidth(650);
                let smallmessage = this.add.bitmapText(350, 375, '5px', `Program Steps: ${this.md.ElapsedSteps}`).setOrigin(.5).setScale(5).setMaxWidth(650);
        
        
                this.topLayer.add(message);
                this.topLayer.add(smallmessage);
        
                let newRecord = false;
                //Set the score info
                let results = C.gd.results;
                let r = C.gd.results.find(r=>r.ID == C.currentLevel)
                if(r != null) {
                    r.Complete = true;
                    if(r.Moves > this.md.ElapsedSteps) {
                        r.Moves = this.md.ElapsedSteps;
                        newRecord = true;
                        C.SaveLocalGameData();
                    } 
                }
                if(newRecord) {
                    this.topLayer.add(this.add.bitmapText(350, 450, '5px', `NEW PERSONAL BEST\n${r.Moves} Steps`).setOrigin(.5).setScale(5).setMaxWidth(650).setCenterAlign().setTint(0xff0000));
        
                }
                
        
            }
        });



    }

    CreateDisplay(mp:LDtkMapPack) {
        mp.displayLayers.forEach(element => {
            element.setVisible(false);
        });

        this.TileArray = [];
        let tempTiles:Phaser.GameObjects.Image[] = [];

        this.md.tiles.forEachTile(t=>{
            if(t.index == 1) {
                let tile = new Tile(this);
                tile.x = t.x;
                tile.y = t.y;
                tile.s.setPosition(t.x * C.TILE_SIZE_X, t.y * C.TILE_SIZE_Y + 1000);
                this.TileArray.push(tile);
                this.groundLayer.add(tile.s);
            }
        });
        this.events.emit(SceneEvents.SOUND, SFX.TilesAppear);
        this.tweens.add({
            targets:this.groundLayer.getChildren(),
            y:{ value: '-=1000', ease: 'Cubic.easeInOut'},
            duration:1000,
            delay: this.tweens.stagger(10,null)

        });

        let endTile = this.TileArray.find(t=>t.x == this.md.end.x && t.y == this.md.end.y);
        endTile.SetTileType(TileType.End);

        this.md.GoBots.forEach(gb=>{
            let r = new Robot(this, gb.ID);
            this.time.addEvent({
                delay:1000,
                callbackScope:this,
                callback:()=>{r.SetStartPosition(gb.x, gb.y, gb.d);
                }
            });
            this.midLayer.add(r.s);
            this.robots.push(r);
        });
        this.md.ZoomBots.forEach(gb=>{
            let r = new Robot(this, gb.ID);
            r.prefix = 'ZoomBot';
            this.time.addEvent({
                delay:1000,
                callbackScope:this,
                callback:()=>{r.SetStartPosition(gb.x, gb.y, gb.d);
                }
            });
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
        if(this.md.Status == MapDataStatus.COMPLETE)
            return;

        this.Reset();
        //Make the programs from the InstructionScene.
        //Find the GoBot instructions.
        let gbi = this.inst.RobotInp.find(i=>i.Name == 'GoBot');
        if(gbi != null)
            this.md.GoBotInstructions = gbi.GetInstructions();
        //Find the ZoomBot instructions.
        let zbi = this.inst.RobotInp.find(i=>i.Name == 'ZoomBot');
        if(zbi != null)
            this.md.ZoomBotInstructions = zbi.GetInstructions();

        let sub = this.inst.RobotInp.find(i=>i.Name == 'Sub1');
        if(sub != null)
            this.md.Sub1Instructions = sub.GetInstructions();

        this.md.Prepare();
        this.currentDelay = this.nextDelay;
        this.status = PlayState.Running;
    }

    Pause() {

    }

    Stop() {

    }

    Reset() {
        if(this.status != PlayState.Running)
            return;
        this.tweens.killAll();
        
        this.md.Reset();
        this.md.AllBots.forEach(element => {
            let r = this.robots.find(r=> r.ID == element.ID);
            r.SetPosition(element.x, element.y, element.d);
            r.s.setVisible(true);
            r.Twitch();
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
        // this.md.AllBots.forEach(element => {
        //     let r = this.robots.find(r=> r.ID == element.ID);
        //     r.SetPosition(element.x, element.y, element.d);
        // });

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