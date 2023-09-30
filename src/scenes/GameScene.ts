import { C } from "../C";
import { Robot } from "../Entities/Robot";
import { Tile, TileType } from "../Entities/Tile";
import { Instructions } from "../enum/Instructions";
import { MapData } from "../helpers/MapData";
import { MapHelper } from "../helpers/MapHelper";
import { LDtkMapPack, LdtkReader } from "../map/LDtkReader";
import { InstructionScene } from "./InstructionScene";

export class GameScene extends Phaser.Scene {
       
    inst:InstructionScene;
    groundLayer:Phaser.GameObjects.Layer;
    midLayer:Phaser.GameObjects.Layer;
    topLayer:Phaser.GameObjects.Layer;
    private md:MapData;


    TileArray:Tile[];

    create() {
        this.cameras.
        main.setBackgroundColor(0x000000)
        .setSize(350, 350)
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

        this.CreateDisplay(mp);
        this.cameras.main.setScroll(-100,-100);
        this.inst.CreateCommands(this.md.Instructions);
       
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
        let startTile = this.TileArray.find(t=>t.x == this.md.player.x && t.y == this.md.player.y);
        let r = new Robot(this);
        r.SetStartPosition(startTile.x, startTile.y, this.md.player.startDir );
        this.midLayer.add(r.s);


        

    }

    Start() {

    }

    Pause() {

    }

    Stop() {

    }



    
}